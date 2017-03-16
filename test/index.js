import { h, render } from 'preact';
import 'preact-jsx-chai';
import Provider, { provide } from '../src';

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

	describe('Provider', () => {
		it('should be a function', () => {
			expect(Provider).to.be.a('function');
		});

		it('should expose props into context', () => {
			mount(<Provider {...context}><Spy /></Provider>);
			expect(Spy).to.have.been.calledOnce.and.calledWith({ children: [] }, context);
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
});
