import Modal from "react-bootstrap/Modal";
import Masonry from "react-masonry-css";
import {Image} from "react-bootstrap";
import NoNetworkImage from "../Images/no-network.png";
import NoNotesImage from "../Images/new-note.jpg";
import {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelopeOpenText, faPencil, faTrash} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import Container from "react-bootstrap/Container";


const Home = () => {

    const [openModal, setOpenModal] = useState(false)
    const [Network, NetCon] = useState('none')
    const [NotesEmpty, NotesHandler] = useState('none')
    const [items, getItems] = useState([]);
    const inputNoteTitle = useRef(null);
    const inputNoteContent = useRef(null);
    const saveType = useRef(null);
    const NoteType = useRef(null);
    const handleEmptyNote = () => NotesHandler('');
    const handleNonEmptyNote = () => NotesHandler('none');
    const handleNetConnection = () => NetCon('');
    const handleClose = () => setOpenModal(false);
    const handleShow = () => setOpenModal(true);
    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1
    };
    let card_colors = ['#c082f8','#8590da','#74c97c','#c9bb62',
        '#aeefe5','#e184d2','#83cc52','#ea6a6a',
        '#cede9c']

    let apiUrl = 'http://34.237.4.39/api/notes'

    // GET notes from API
    useEffect(() => {
        fetch(apiUrl+'/create')
            .then((response) => response.json())
            .then((data) => {
                if(!data.status){
                    handleEmptyNote()
                }else{
                    handleNonEmptyNote()
                    getItems(data.response.data);
                }
            })
            .catch((err) => {
                console.log(err.message)
                handleNetConnection()
            });
    }, []);

    // Convert array to JSX items
    const itemData = items.map(function (item) {
        const randomColor = Math.floor(Math.random() * card_colors.length)
        // const CardSize = Math.floor(100) + '%'
        return <div className="card" style={{background: card_colors[randomColor], width: '18rem'}} key={item._id}>
            <div className="card-body">
                <h5 className="card-title">{item.note_title}</h5>
                <p className="card-text">{item.note_content.substring(0, 100)}{item.note_content.length >= 100 && '...'}</p>
            </div>
            <div className="card-footer">
                <button className="btn btn-sm" style={{float: 'right'}} title="Delete"
                        onClick={() => deleteNote(item._id)}><FontAwesomeIcon icon={faTrash}/></button>
                <button className="btn btn-sm" style={{float: 'right'}} title="Edit" onClick={() => editNote(item._id)}>
                    <FontAwesomeIcon icon={faPencil}/></button>
                <Link to={item.note_slug} className="btn btn-sm" style={{float: 'right'}} title="Open"><FontAwesomeIcon
                    icon={faEnvelopeOpenText}/> </Link>
            </div>
        </div>
    });

    // Arrange Notes in Column Cards
    function generateNotes(){
        return (  <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
        >
            { itemData }
        </Masonry>);
    }

    // Creating Input Design for Note
    function notesInput(){
        return <div className="row justify-content-center">
            <div className="col-xl-6">
                <div className="text-center">
                    <div className="row">
                        <div className="col give_space5" >
                            <input type="text" className="form-control" placeholder={'Take a note..'} onClick={()=>{
                                handleShow()
                                saveType.current.value = 'create'
                            }}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    // Creating Modal for Note Input
    function NoteModal(){
        return <Modal show={openModal} onHide={handleClose}  backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <input type="hidden" ref={saveType} value="" />
                <input type="hidden" ref={NoteType} value="" />
                <Modal.Title style={{width:'100%'}} >
                    <input type="text" ref={inputNoteTitle}  className="form-control no-border " placeholder={'What is this note about?'} id="note_title" />
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <textarea id="note_content" ref={inputNoteContent} className="form-control no-border" rows="15" placeholder={'Write a note..'} style={{resize: 'none'}}/>
            </Modal.Body>
            <Modal.Footer>
                <button id={'save-button'} className={'form-control btn btn-success'} onClick={()=>saveNote()}>Save</button>
            </Modal.Footer>
        </Modal>
    }

    //Validation function for Notes
    function Validate(){
        if(inputNoteTitle.current.value === ''){
            toast.error('What is this note about?')
            return false
        }
        if(inputNoteContent.current.value === ''){
            toast.error('Write something to remember')
            return false
        }
        return true
    }

    // Creating Save Function (Works for both ADD and UPDATE)
    function saveNote(){
        if(Validate()) {
            let Method = 'POST'
            if (saveType.current.value === 'update') {
                apiUrl = apiUrl + '/' + NoteType.current.value
                Method = 'PUT'
            }
            let data = JSON.stringify({
                note_title: inputNoteTitle.current.value,
                note_content: inputNoteContent.current.value
            })
            fetch(apiUrl, {
                method: Method,
                body:
                data,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    let noteData = data.response;
                    handleClose();
                    handleNonEmptyNote();
                    toast.success("Success");
                    if (saveType.current.value !== 'update') {
                        getItems((items) => [noteData, ...items]);
                    } else {
                        getItems(items.filter((item) => {
                                return item._id !== NoteType.current.value;
                            })
                        );
                        getItems((items) => [noteData, ...items]);
                    }
                })
                .catch((err) => {
                    console.log(err.message);
                    handleNetConnection()
                });
        }
    }

    // Creating Edit Note function which retrieves note data in modal
    function editNote(id){
        handleShow()
        fetch(apiUrl+'/'+id+'/edit')
            .then((response) => response.json())
            .then((data) => {
                if(data.status){
                    let res = data.response
                    inputNoteTitle.current.value = res.note_title
                    inputNoteContent.current.value = res.note_content
                    saveType.current.value = 'update'
                    NoteType.current.value = id
                }
            })
            .catch((err) => {
                console.log(err.message)
                handleNetConnection()
            });
    }

    // Creating Delete Function
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

    // Creating NoNetwork Function (Triggers when API is not reachable)
    function NoNetwork(){
        return <div className={'text-center'} style={{display:Network}}>
            <Image src={NoNetworkImage} width={'20%'} style={{opacity:'30%'}}/>
            <h5 style={{opacity:'30%'}}>Connection Lost</h5>
        </div>
    }

    // Creating NoNotes Function (Triggers when Notes are empty)
    function NoNotes(){
        return <div className={'text-center'} style={{display:NotesEmpty}}>
            <Image src={NoNotesImage} width={'20%'} style={{opacity:'50%'}}/>
            <h5 style={{opacity:'50%'}}>Your notes are empty!</h5>
        </div>
    }

    return (
        <>
        <Container className="position-relative">
            { notesInput() }
        </Container>
        <Container className="position-relative">
            {generateNotes()}
            {NoNetwork()}
            {NoNotes()}
        </Container>
        { NoteModal() }
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </>
    )

};
export default Home;