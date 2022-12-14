import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useEffect, useState} from "react";
import { useParams } from "react-router";
import {Link} from "react-router-dom";

//ViewNote for viewing individual note
function ViewNote(){

    let { noteSlug } = useParams();
    const [Note, getNote] = useState([]);

    let apiUrl = 'http://34.237.4.39/api/notes'

    // Grab Note data based on note slug
    useEffect(() => {
        fetch(apiUrl+'/'+noteSlug)
            .then((response) => response.json())
            .then((data) => {
                if(data.status){
                    let res = data.response
                    getNote(res)
                }
            })
            .catch((err) => {
                console.log(err.message)
            });
    }, [noteSlug]);

    let card = <div className="card">
        <div className="card-header">
            <h5 className="card-title">{Note.note_title}</h5>
        </div>
        <div className="card-body">
            <p className="card-text">{Note.note_content}</p>
        </div>
        <div className="card-footer">
            <Link to={'/'} className="btn btn-sm btn-success" title="Go Back">Go Back</Link>
        </div>
    </div>

    return (
        <div className="give_space5">
            {card}
        </div>
    )
}
export default ViewNote;