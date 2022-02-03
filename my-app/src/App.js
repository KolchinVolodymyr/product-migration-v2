import React from 'react';
import 'materialize-css';
import './App.css';
import { Header } from './components/Header';
import { FileUpload } from './components/FileUpload';

function App() {
    return (
        <div className="App">
            <Header></Header>
            <div className="container">
                <div className="row">
                    <div className="col s12 m3"></div>
                    <div className="col s12 m6">
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">Data transfer script</span>
                                <p>We'll look at migrating products data coming from Shopify to BigCommerce</p>
                                <p>Data must be in CSV format !!!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <FileUpload></FileUpload>
                </div>
            </div>
        </div>
    );
}

export default App;