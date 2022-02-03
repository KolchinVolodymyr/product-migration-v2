import React from 'react'

export const Header = () => {

    const headerStyle = {

        width: '100%',
        padding: '2%',
        backgroundColor: "#ff5722",
        color: 'white',
        textAlign: 'center'
    }

    return(
        <div style={headerStyle}>
            <h3>Customers Migration [Shopify -> BigCommerce]</h3>
        </div>
    )
}