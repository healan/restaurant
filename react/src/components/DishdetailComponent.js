import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, CardTitle, Breadcrumb, BreadcrumbItem, Button, Row, Col, Label, Modal, ModalHeader, ModalBody,
    Form, FormGroup, Input } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

function RenderDish({dish}) { 
    return(
        <Card>
            <CardImg top src={baseUrl + dish.image} alt={dish.name} />
            <CardBody>
                <CardTitle>{dish.name}</CardTitle>
                <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
    );
}

function RenderComments({comments}){
    return(
        <div>
            <h4>Comments</h4>
            {comments.map((comment) => {
                return(
                    <div key = {comment.id}>
                        <p>{comment.comment}</p>
                        <p>--{comment.author},{new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                    </div>
                    ); 
                })
            }  
        </div>  
    );
}

class Dishdetail extends Component{
    constructor(props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this); 
        
        this.state = {
            isModalOpen: false
        };
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        this.props.postComment(this.props.dish.id, values.rating, values.author, values.comment);
        // console.log('Current State is: ' + JSON.stringify(values));
         //alert('Current State is: ' + JSON.stringify(values));
        // event.preventDefault();
    }

    render() {
        const required = (val) => val && val.length;
        const maxLength = (len) => (val) => !(val) || (val.length <= len);
        const minLength = (len) => (val) => val && (val.length >= len);

        if (this.props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (this.props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{this.props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (this.props.dish != null)
            return (
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{this.props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{this.props.dish.name}</h3>
                            <hr />
                        </div>                
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
                            <RenderDish dish={this.props.dish} />
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            <RenderComments comments={this.props.comments}/>
                            <Row className="form-group">
                                <Col md={{size:10}}>
                                    <Button onClick={this.toggleModal} type="submit" color="primary">
                                            Submit Comment
                                    </Button>
                                </Col>
                            </Row>

                            {/* -----------modal--------------- */}
                            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                                <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                                <ModalBody>
                                    <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                        <Row className="form-group">
                                            <Label htmlFor="rating" md={12}>Rating</Label> 
                                        </Row>
                                        <Row className="form-group">
                                            <Col md={12}>
                                                <Control.select model=".rating" name="rating"
                                                    className="form-control">
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                </Control.select>
                                            </Col>
                                        </Row>
                                        <Row className="form-group">
                                            <Label htmlFor="author" md={12}>Your Name</Label>
                                        </Row>
                                        <Row className="form-group">
                                            <Col md={12}>
                                                <Control.text model=".author" id="author" name="author"
                                                    placeholder="First Name"
                                                    className="form-control"
                                                    validators={{
                                                        required, minLength: minLength(3), maxLength: maxLength(15)
                                                    }}
                                                    />
                                                <Errors
                                                    className="text-danger"
                                                    model=".firstname"
                                                    show="touched"
                                                    messages={{
                                                        required: 'Required',
                                                        minLength: 'Must be greater than 2 characters',
                                                        maxLength: 'Must be 15 characters or less'
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Row className="form-group">
                                            <Label htmlFor="comment" md={12}>Commnet</Label>
                                        </Row>
                                        <Row className="form-group">
                                            <Col md={12}>
                                                <Control.textarea model=".comment" id="comment" name="comment"
                                                    rows="12"
                                                    className="form-control" />
                                            </Col>
                                        </Row>
                                        <br/>
                                        <Row className="form-group">
                                            <Col md={{size:10}}>
                                                <Button type="submit" color="primary">
                                                    Submit
                                                </Button>
                                            </Col>
                                        </Row>
                                    </LocalForm>
                                </ModalBody>
                            </Modal>
                        </div>
                    </div>
                </div>
            );
        else
            return(
                <div></div>
            );
        }
    }

export default Dishdetail;