import React from 'react';
import { useState } from "react";
import "./../App.css";
import {Preloader} from "./Preloader";
import { useAlert } from 'react-alert';


export const FileUpload = () => {
const [selectedFile, setSelectedFile] = useState();
const [isFilePicked, setIsFilePicked] = useState(false);
const [isShown, setIsShown] = useState(false);
const [data, setData] = useState([]);
const [loader, setLoader] = useState(false);
const alert = useAlert();

const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    event.target.files[0] && setIsFilePicked(true);
};

const handleSubmission = () => {
    // HANDLING FILE AS SENDING FILE INTO BACKEND
    if (!isFilePicked) {
        alert.show("Please select a file ", {
            title: "Please select a file "
        });
        return
    }
    if(selectedFile.type !== "text/csv") {
        alert.show("Incorrect file format. Please select file format .scv", {
            title: "Incorrect file format"
        });
        return
    }
    const formData = new FormData();
    formData.append("File", selectedFile);
    setLoader(true);
    // API CALL
    fetch(" http://localhost:8080/", {
        method: "POST",
        body: formData,
    })
    .then((response) => response.json())
    .then((result) => {
        console.log("Success:", result);
        setData(result.ValidationData)
        if(isShown !== true) {
            setIsShown(!isShown);
        }
    })
    .catch((error) => {
        alert.show("Server response error. Status code: 500 ", {
            title: "Server response error"
        });
    })
    .finally(()=>{
        setLoader(false);
    })
};

return (
    <div className="form-file">
        <div className="file-field input-field">
            <div className="btn">
                <span>File .csv</span>
                <input type="file" onChange={changeHandler}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
        </div>
        <button className="waves-effect waves-light btn" onClick={handleSubmission}>Upload file</button>
        {isShown &&
            <div>
                <a className="btn waves-effect waves-light position-btn" href='http://localhost:8080/download'>Download</a>
                <table>
                    <thead>
                        <tr>
                            <th>Error string</th>
                            <th>Validation</th>
                        </tr>
                    </thead>
                    {data.map((el, index)=>{
                        return(
                            <tbody key={index}>
                                <tr>
                                    <td>string{el[0]}</td>
                                    <td>{el[1]}</td>
                                </tr>
                            </tbody>
                        )
                    })}
                </table>
            </div>
        }
        {loader  && <Preloader />}
    </div>
    );
};