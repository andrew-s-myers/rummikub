describe('Login flow', () => {
	it('logs in successfully with valid credentials', () => {
		cy.visit('/login');
		cy.get('input[name=email]').type('test@example.com');
		cy.get('input[name=password]').type('password');
		cy.get('button[type=submit]').click();
		cy.url().should('include', '/dashboard');
	});
});
