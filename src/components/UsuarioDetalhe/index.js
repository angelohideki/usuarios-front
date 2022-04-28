import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import './styles.css';
import { FiLock, FiCornerDownLeft } from 'react-icons/fi';
import api from "../../services/api";
import { Button, Modal, Form, Row, Container, Col, Alert } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function UsuarioDetalhe() {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setStatus({
            type: '',
            message: ''
        });
    };

    const [id, setId] = useState(null);
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState(0);
    const [senha, setSenha] = useState('');
    const [senhaAntiga, setSenhaAntiga] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [senhaConfirma, setSenhaConfirma] = useState('');
    const { usuarioId } = useParams();
    const history = useNavigate();

    const [status, setStatus] = useState({
        type: '',
        message: ''
    });
    async function validate(value) {

        let numberRegEx = /[0-9]+/;
        let minusculoRegEx = /[a-z]+/;
        let maiusculoRegEx = /[A-Z]+/;
        let especiaisRegEx = /[a-zA-Z0-9]+/;
        if (value.length < 8 || value.length > 12) {
            setStatus({
                type: 'error',
                message: "A senha deve ter de 8 a 12 caracteres"
            });
            return false;
        }
        if (value.replace(especiaisRegEx, '').length < 1) {
            setStatus({
                type: 'error',
                message: "A senha deve conter pelo um caracter especial"
            });
            return false;
        }
        if (maiusculoRegEx.test(value) === false) {
            setStatus({
                type: 'error',
                message: "A senha deve conter pelo uma letra maiúscula"
            });
            return false;
        }
        if (minusculoRegEx.test(value) === false) {
            setStatus({
                type: 'error',
                message: "A senha deve conter pelo uma letra minúscula"
            });
            return false;
        }
        if (numberRegEx.test(value) === false) {
            setStatus({
                type: 'error',
                message: "A senha deve conter pelo menos um número"
            });
            return false;
        }
        return true;
    }

    useEffect(() => {
        loadUsuario();
    });

    async function loadUsuario() {
        try {

            const response = await api.get(`api/usuario/${usuarioId}`);
            setId(response.data.id);
            setNome(response.data.nome);
            setEmail(response.data.email);
            setTelefone(response.data.telefone);
            setSenhaAntiga(response.data.senha);

        } catch (error) {

            alert('Erro ao recuperar o usuario' + error);
            history('/');

        }
    }

    async function saveOrUpdate(event) {
        event.preventDefault();
        setStatus({
            type: '',
            mensage: ''
        });
        if (senhaAtual === "") {
            setStatus({
                type: 'error',
                message: "Informe a senha atual do usuário"
            });
            return;
        }
        if (senhaAtual !== senhaAntiga) {
            setStatus({
                type: 'error',
                message: "A senha atual está incorreta"
            });
            return;
        }
        if (senha === "") {
            setStatus({
                type: 'error',
                message: "Informe a nova senha"
            });
            return;
        }
        if (!(await validate(senha))) {
            return;
        }
        if (senhaConfirma === "") {
            setStatus({
                type: 'error',
                message: "Repita a nova senha"
            });
            return;
        }

        if (senha !== senhaConfirma) {
            setStatus({
                type: 'error',
                message: "As senhas não são iguais verifique!"
            });
            return;
        }
        const data = {
            senha
        }
        try {
            if (usuarioId === '0') {
                await api.post('api/usuario', data);
            } else {
                data.id = id;
                await api.put(`api/usuario/${id}`, data);
            }
            setShow(false);
            Swal.fire({
                icon: 'success',
                title: 'Senha alterada com Sucesso!'
            })
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erro ao atualizar a senha!'
            })
            return;
        }
    }

    return (
        <div className="novo-usuario-container">
            <Container>
                <Row>
                    <Col><h1>Informações do Usuário</h1></Col>
                </Row>
                <section>
                    <Link className="back-link" to="/">
                        <FiCornerDownLeft size={25} color="#17202a" />
                        Retornar
                    </Link>
                </section>
                <hr />
                <div className="content">
                    <Row>
                        <Container>
                            <Row>
                                <Col><h4>Dados Básicos</h4></Col>
                                <Col md={{ span: 2, offset: 8 }}>
                                    <Button variant="primary" onClick={handleShow}>
                                        <FiLock size={25} color="#fff" />&nbsp;&nbsp;
                                        Alterar senha
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    Configuração referente aos Dados do Usuário
                                </Col>
                            </Row>
                        </Container>
                    </Row>
                    <hr />
                    <Row>
                        <Container>
                            <Row>
                                <Col><h4>E-mail - (Utilizado como login)</h4></Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h6>{email}</h6>
                                </Col>
                            </Row>
                        </Container>
                    </Row>
                    <hr />
                    <Row>
                        <Container>
                            <Row>
                                <Col><h4>Nome</h4></Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h6>{nome}</h6>
                                </Col>
                            </Row>
                        </Container>
                    </Row>
                    <hr />
                    <Row>
                        <Container>
                            <Row>
                                <Col><h4>Senha</h4></Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h6>********</h6>
                                </Col>
                            </Row>
                        </Container>
                    </Row>
                    <hr />
                    <Row>
                        <Container>
                            <Row>
                                <Col><h4>Telefone</h4></Col>
                            </Row>
                            <Row>
                                <Col>
                                    <h6>{telefone}</h6>
                                </Col>
                            </Row>
                        </Container>
                    </Row>
                </div>
                <hr />

            </Container >

            <Modal show={show} onHide={handleClose} variant="primary">
                <Modal.Header closeButton variant="secondary">
                    <Modal.Title ><FiLock size={25} color="#fff" />&nbsp;&nbsp;Alterando Senha</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            {status.type === 'error' ?
                                <Alert variant={'danger'}>
                                    {status.message}
                                </Alert> : ""}
                            <Form.Label><h5>Senha atual *</h5></Form.Label>
                            <Form.Control id="senhaAtual" type="password" required placeholder="Senha atual do usuário" onChange={e => setSenhaAtual(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><h5>Nova Senha *</h5></Form.Label>
                            <Form.Control type="password" required placeholder="Nova Senha" onChange={e => setSenha(e.target.value)} />
                            <Form.Text className="text-muted">
                                A senha deve ter no mínimo 8 e máximo 12 caracteres, deve conter pelo menos uma letra maiúscula, números e caracteres especiais.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label><h5>Confirme a Nova Senha *</h5></Form.Label>
                            <Form.Control type="password" placeholder="Repita a Nova Senha" onChange={e => setSenhaConfirma(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={saveOrUpdate}>
                        Confirmar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >

    );
}