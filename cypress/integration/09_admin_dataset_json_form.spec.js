context('Admin dataset json form', () => {

    beforeEach(() => {
        cy.drupalLogin('admin', 'admin')
    })
    
    it('The dataset form has the correct required fields.', () => {
        cy.visit("http://dkan/admin/dkan/dataset")
        cy.get('#root__title').should('have.text', 'Project Open Data Dataset')
        cy.get('#root .control-label[for="root_title"] > .required').should('be.visible')
        cy.get('#root .control-label[for="root_identifier"] > .required').should('be.visible')
        cy.get('#root .control-label[for="root_description"] > .required').should('be.visible')
        cy.get('#root .control-label[for="root_accessLevel"] > .required').should('be.visible')
        cy.get('#root .control-label[for="root_modified"] > .required').should('be.visible')
        cy.get('#root .control-label[for="root_publisher_name"] > .required').should('be.visible')
        cy.get('#root .control-label[for="root_contactPoint_fn"] > .required').should('be.visible')
        cy.get('#root .control-label[for="root_contactPoint_hasEmail"] > .required').should('be.visible')
        cy.get('#root_keyword__title > .required').should('be.visible')
    })

    it.only('User can create and delete a dataset with the admin UI.', () => {
        cy.visit("http://dkan/admin/dkan/dataset")
        cy.wait(2000)
        cy.get('#root_title').type('DKANTEST dataset title', { force:true } )
        cy.get('#root_identifier').type('DKANTEST1234567890', { force:true } )
        cy.get('#root_description').type('DKANTEST dataset description.', { force:true } )
        cy.get('#root_accessLevel').select('public', { force:true } )
        cy.get('#root_modified').type('2020-02-02', { force:true } )
        cy.get('#root_publisher_name').type('DKANTEST Publisher', { force:true } )
        cy.get('#root_contactPoint_fn').type('DKANTEST Contact Name', { force:true } )
        cy.get('#root_contactPoint_hasEmail').type('mailto:dkantest@test.com', { force:true } )
        cy.get('#root_keyword_0').type('open data', { force:true } )
        cy.get('.btn-success').click({ force:true })
        cy.get('.toast-content-container > .toast-content').should('contain','DKANTEST1234567890 has been created')
        cy.get('.dc-form-actions button[type="button"]').click({ force:true })
        cy.wait(2000)
        cy.get('#edit-node-bulk-form-0').check({ force:true })
        cy.get('#edit-submit--2').click({ force:true })
        cy.get('input[value="Delete"]').click({ force:true })
        cy.get('.messages').should('contain','Deleted 1 content item.')
    })

})