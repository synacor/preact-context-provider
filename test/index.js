import { h, render } from 'preact';
import 'preact-jsx-chai';
import Provider, { MergingProvider, provide, mergingProvide } from '../src';

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
			expect(Spy).to.have.been.calledOnce.and.calledWith({ children: [] }, context);
		});

		it('should overwrite higher context keys', () => {
			mount(
			<Provider {...context}>
				<Provider a="overwrittenA" >
					<Spy />
				</Provider>
			</Provider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({ children: [] }, { a: 'overwrittenA', b: 'b' });

		});

	});

	describe('<MergingProvider />', () => {
		it('should overwrite higher context keys by default if mergeWithParent is not true', () => {
			mount(
			<MergingProvider {...context}>
				<MergingProvider a="overwrittenA" >
					<Spy />
				</MergingProvider>
			</MergingProvider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({ children: [] }, { a: 'overwrittenA', b: 'b' });

		});

		it('should deep merge with higher context keys, giving them precendence, when mergeWithParent is true', () => {
			mount(
			<MergingProvider {...context}>
				<MergingProvider mergeWithParent a={{ name: 'notOverwrittenNameA', newProp: 'c' }} b="newB">
					<Spy />
				</MergingProvider>
			</MergingProvider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({ children: [] },
				{ a: { name: 'a', newProp: 'c' }, b: 'b' });
		});

		it('should deep merge with selected higher context keys, giving them precendence, when mergeWithParent is an array', () => {
			mount(
			<MergingProvider a={{ name: 'a' }} b={{ name: 'b' }} >
				<MergingProvider mergeWithParent={['a']} a={{ name: 'notOverwrittenNameA', newProp: 'c' }} b={{ newProp: 'd' }} >
					<Spy />
				</MergingProvider>
			</MergingProvider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({ children: [] },
				{ a: { name: 'a', newProp: 'c' }, b: { newProp: 'd' } });
		});

		it('should allow parent to prevent child value from merging by using null value for a key', () => {
			mount(
			<MergingProvider a={null} b={{ name: 'b' }} >
				<MergingProvider mergeWithParent a={{ name: 'a', newProp: 'c' }} b={{ newProp: 'd' }} >
					<Spy />
				</MergingProvider>
			</MergingProvider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({ children: [] },
				{ a: null, b: { name: 'b', newProp: 'd' } });
		});
	});

	describe('provide()', () => {
		it('should be a function', () => {
			expect(provide).to.be.a('function');
		});

		it('should wrap a child with a <Provider> tag with the supplied context, and pass through any props to the child after wrapped', () => {
			let ProvidedSpy = provide(context)(Spy);
			expect(<ProvidedSpy foo="bar" />).to.equal(<Provider a={{ name: 'a' }} b="b"><Spy foo="bar" /></Provider>);
		});
	});

	describe('mergingProvide()', () => {
		it('should be a function', () => {
			expect(mergingProvide).to.be.a('function');
		});

		it('should wrap a child with a <MergingProvider> tag with the supplied context, and pass through any props to the child after wrapped', () => {
			let MergingProvidedSpy = mergingProvide({ ...context, mergeWithParent: true })(Spy);
			expect(<MergingProvidedSpy foo="bar" />).to.equal(<MergingProvider a={{ name: 'a' }} b="b" mergeWithParent><Spy foo="bar" /></MergingProvider>);
		});
	});
});
