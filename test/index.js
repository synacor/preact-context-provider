import { h, render } from 'preact';
import Provider, { MergingProvider, provide, mergingProvide } from 'preact-context-provider';

describe('preact-context-provider', () => {
	let scratch = document.createElement('div'),
		mount = jsx => root = render(jsx, scratch, root),
		context = {	a: { name: 'a' },	b: 'b' },
		Spy,
		root;

	beforeEach( () => {
		mount(h(() => null));
		Spy = sinon.spy();
		scratch.innerHTML = '';
	});

	describe('<Provider />', () => {
		it('should be a function', () => {
			expect(Provider).to.be.a('function');
		});

		it('should expose props into context', () => {
			mount(<Provider {...context}><Spy /></Provider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({}, context);
		});

		it('should overwrite higher context keys', () => {
			mount(
				<Provider {...context}>
					<Provider a="overwrittenA" >
						<Spy />
					</Provider>
				</Provider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({}, { a: 'overwrittenA', b: 'b' });

		});

	});

	describe('<MergingProvider />', () => {
		it('should deep merge with higher context keys, giving them precendence, when mergeProps is unset', () => {
			mount(
				<MergingProvider {...context}>
					<MergingProvider a={{ name: 'notOverwrittenNameA', newProp: 'c' }} b="newB">
						<Spy />
					</MergingProvider>
				</MergingProvider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({},
				{ a: { name: 'a', newProp: 'c' }, b: 'b' });
		});

		it('should deep merge with higher context keys, giving them precendence, when mergeProps is true', () => {
			mount(
				<MergingProvider {...context}>
					<MergingProvider mergeProps a={{ name: 'notOverwrittenNameA', newProp: 'c' }} b="newB">
						<Spy />
					</MergingProvider>
				</MergingProvider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({},
				{ a: { name: 'a', newProp: 'c' }, b: 'b' });
		});

		it('should deep merge with selected higher context keys, giving them precendence, when mergeProps is an array', () => {
			mount(
				<MergingProvider a={{ name: 'a' }} b={{ name: 'b' }} >
					<MergingProvider mergeProps={['a']} a={{ name: 'notOverwrittenNameA', newProp: 'c' }} b={{ newProp: 'd' }} >
						<Spy />
					</MergingProvider>
				</MergingProvider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({},
				{ a: { name: 'a', newProp: 'c' }, b: { newProp: 'd' } });
		});

		it('should allow parent to prevent child value from merging by using null value for a key', () => {
			mount(
				<MergingProvider a={null} b={{ name: 'b' }} >
					<MergingProvider mergeProps a={{ name: 'a', newProp: 'c' }} b={{ newProp: 'd' }} >
						<Spy />
					</MergingProvider>
				</MergingProvider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({},
				{ a: null, b: { name: 'b', newProp: 'd' } });
		});
	});

	describe('provide()', () => {
		it('should be a function', () => {
			expect(provide).to.be.a('function');
		});

		it('should wrap a child with a <Provider> tag with the supplied context, and pass through any props to the child after wrapped', () => {
			let ProvidedSpy = provide(context)(Spy);
			mount(<ProvidedSpy foo="bar" />);
			expect(Spy).to.have.been.calledOnce.and.calledWith({foo:'bar'}, {
				a: { name: 'a' }, b:"b"
			});
		});

		describe('getWrappedComponent()', () => {

			it('should be a function', () => {
				let Wrapped = provide(context)(Spy);
				expect(Wrapped.getWrappedComponent).to.be.a('function');
			});

			it('should return the Child component that it is wrapping', () => {
				let Wrapped = provide(context)(Spy);
				expect(Wrapped.getWrappedComponent()).to.equal(Spy);
			});

			it('should recursively call getWrappedComponent() on Child components to return the first non-decorator Child', () => {
				let Wrapped = provide(context)(provide(context)(Spy));
				expect(Wrapped.getWrappedComponent()).to.equal(Spy);
			});

		});

	});

	describe('mergingProvide()', () => {
		it('should be a function', () => {
			expect(mergingProvide).to.be.a('function');
		});

		it('should wrap a child with a <MergingProvider> tag with the supplied context, and pass through any props to the child after wrapped', () => {
			let MergingProvidedSpy = mergingProvide({ ...context, mergeProps: true })(Spy);
			mount(<MergingProvidedSpy foo="bar" />);
			expect(Spy).to.have.been.calledOnce.and.calledWith({foo:'bar'}, {
				a: { name: 'a' }, b:"b"
			});
		});

		describe('getWrappedComponent()', () => {

			it('should be a function', () => {
				let MergingProvidedSpy = mergingProvide({ ...context, mergeProps: true })(Spy);
				expect(MergingProvidedSpy.getWrappedComponent).to.be.a('function');
			});

			it('should return the Child component that it is wrapping', () => {
				let MergingProvidedSpy = mergingProvide({ ...context, mergeProps: true })(Spy);
				expect(MergingProvidedSpy.getWrappedComponent()).to.equal(Spy);
			});

			it('should recursively call getWrappedComponent() on Child components to return the first non-decorator Child', () => {
				let MergingProvidedSpy = mergingProvide({ ...context, mergeProps: true })(mergingProvide({ ...context, mergeProps: true })(Spy));
				expect(MergingProvidedSpy.getWrappedComponent()).to.equal(Spy);
			});

		});

	});
});
