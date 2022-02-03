import React from 'react'

export const Header = () => {

    const headerStyle = {

        width: '100%',
        padding: '2%',
        backgroundColor: "#2231ff",
        color: 'white',
        textAlign: 'center'
    }

    return(
        <div style={headerStyle}>
            <h3>Products Migration [Shopify -> BigCommerce]</h3>
        </div>
    )
}