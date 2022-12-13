import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Masonry from 'react-masonry-css';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import Container from 'react-bootstrap/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil,faEnvelopeOpenText, faTrash } from '@fortawesome/free-solid-svg-icons'
import Modal from "react-bootstrap/Modal";
import {useEffect, useRef, useState} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

    const [openModal, setOpenModal] = useState(false)
    const [items, getItems] = useState([]);
    const handleClose = () => setOpenModal(false);
    const handleShow = () => setOpenModal(true);
    const inputNoteTitle = useRef(null);
    const inputNoteContent = useRef(null);

    const apiUrl = 'http://127.0.0.1:8000/api/notes'

    useEffect(() => {
        fetch(apiUrl+'/create')
            .then((response) => response.json())
            .then((data) => {
                getItems(data.response.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    let card_colors = ['#c082f8','#8590da','#74c97c','#c9bb62',
        '#aeefe5','#e184d2','#83cc52','#ea6a6a',
        '#cede9c']

    // Convert array to JSX items
    var itemData = items.map(function(item) {
        const randomColor = Math.floor(Math.random() * card_colors.length)
        const CardSize = Math.floor(30 + item.note_title.length) + '%'
        return <div className="card" style={{background: card_colors[randomColor], width: '18rem', height : CardSize }} key={item._id}>
            <div className="card-body">
                <h5 className="card-title">{item.note_title}</h5>
                <p className="card-text">{item.note_content}</p>
            </div>
            <div className="card-footer">
                <button className="btn btn-sm" style={{float:'right'}} title="Delete" onClick={()=>deleteNote(item._id)}><FontAwesomeIcon icon={faTrash} /> </button>
                <button className="btn btn-sm" style={{float:'right'}} title="Edit"><FontAwesomeIcon icon={faPencil} /> </button>
                <button className="btn btn-sm" style={{float:'right'}} title="Open"><FontAwesomeIcon icon={faEnvelopeOpenText} /> </button>
            </div>
        </div>
    });

    function addNote(){
        let data = JSON.stringify({
            note_title : inputNoteTitle.current.value,
            note_content :  inputNoteContent.current.value
        })

        fetch(apiUrl, {
                method: 'POST',
                body:
                   data
                ,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    let noteData = data.response;
                    handleClose();
                    toast.success("Note Added");
                    getItems((items) => [noteData, ...items]);
                })
                .catch((err) => {
                    console.log(err.message);
                });
    }

    function deleteNote(id){
        fetch(apiUrl+'/'+id, {
                method: 'DELETE',
            }).then((response) => {
                if (response.status === 200) {
                    getItems(items.filter((item) => {
                        return item._id !== id;
                        })
                    );
                    toast.success("Note Deleted");

                }
            });

    }



    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };

    function generateNotes(){
        return (  <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            { itemData }
        </Masonry>);
    }

    function navBar(){
        return <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <Container>
                <h5 className="navbar-brand">Notes App</h5>
            </Container>
        </nav>
    }

    function notesInput(){
        return <div className="row justify-content-center">
            <div className="col-xl-6">
                <div className="text-center">
                    <div className="row">
                        <div className="col give_space5" >
                            <input type="text" className="form-control" placeholder={'Take a note..'} onClick={()=>{
                                handleShow()
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    function NoteModal(){
        return <Modal show={openModal} onHide={handleClose}  backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title style={{width:'100%'}} ><input type="text" ref={inputNoteTitle}  className="form-control no-border" placeholder={'What is this note about?'} id="note_title" /></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea id="note_content" ref={inputNoteContent} className="form-control no-border" rows="15" placeholder={'Write a note..'} style={{resize: 'none'}}/>
            </Modal.Body>
            <Modal.Footer>
                <button id={'save-button'} className={'form-control btn btn-success'} onClick={()=>addNote()}>Save</button>
            </Modal.Footer>
        </Modal>
    }


    return (
        <ThemeProvider
            breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
            minBreakpoint="xxs">
            { navBar() }
            <Container className="position-relative">
                { notesInput() }
            </Container>
            <Container className="position-relative">
                {generateNotes()}
            </Container>
            { NoteModal() }
            <ToastContainer />
        </ThemeProvider>
  );
}

export default App;
