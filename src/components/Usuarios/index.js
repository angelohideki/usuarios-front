import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './styles.css';
import api from "../../services/api";
import { Form, FormControl, InputGroup, Button, Table } from "react-bootstrap";
import Menu from "../Menu";
import Moment from "react-moment";
import Swal from 'sweetalert2';

export default function Usuarios() {

    const [searchInput, setSearchInput] = useState('');
    const [usuarios, setUsuarios] = useState([]);
    const history = useNavigate();
    const letrasRegEx = /[a-zA-Z]+/;
    const [status, setStatus] = useState({
        type: '',
        message: ''
    });

    const pesquisaUsuarios = (e) => {
        e.preventDefault();

        if (searchInput === "") {
            try {
                api.get('api/usuario').then(
                    response => {
                        if (response.data) {
                            setUsuarios(response.data);
                        } else {
                            setStatus({
                                type: 'error',
                                message: 'Nenhum usuário encontrado'
                            });
                            setUsuarios([]);
                        }
                    })
                return;
            } catch (error) {
                console.log("Erro ao consultar os usuários");
                return;
            }


        } else {
            if (searchInput.replace(letrasRegEx, '').length < 1) {
                Swal.fire({
                    icon: 'error',
                    title: 'Informe um ID válido utilizando apenas números'
                })
                return;
            }
            try {
                api.get(`api/usuario/${searchInput}`).then(
                    response => {
                        if (response.data) {
                            setUsuarios([
                                response.data
                            ]);
                        } else {
                            setStatus({
                                type: 'error',
                                message: 'Nenhum usuário encontrado com o ID = ' + searchInput
                            });
                            setUsuarios([]);
                        }
                    });
                return;
            } catch (error) {
                console.log(error);
            }
        }
        return false;
    }

    async function detalhesUsuario(id) {
        try {
            history(`/usuario/detalhe/${id}`);
        } catch (error) {
            alert('Não foi possível abrir detalhes do usuario');
            history("/");
        }
    }

    return (
        <div className="usuario-container">
            <Menu />
            <header><h2>Relação de Usuários</h2></header>
            <Form>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Informe o ID do usuário"
                        aria-label="Informe o ID do usuário"
                        aria-describedby="basic-addon2"
                        onChange={(e) => setSearchInput(e.target.value)}
                    />
                    <Button type="submit" onClick={pesquisaUsuarios}>Pesquisar</Button>
                </InputGroup>
            </Form>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Telefone</th>
                        <th>Data Cadastro</th>
                        <th>Ativo</th>
                        <th>Opções</th>
                    </tr>
                </thead>

                {usuarios.length > 0 ? (
                    <tbody>
                        {
                            usuarios.map((usuario) =>
                                <tr key={usuario.id}>
                                    <td>{usuario.id}</td>
                                    <td>{usuario.nome}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.telefone}</td>
                                    <td><Moment format="DD/MM/YYYY">{usuario.dataCadastro}</Moment></td>
                                    <td>{usuario.ativo === true ? 'ATIVO' : 'INATIVO'}</td>
                                    <td><Button variant="secondary" onClick={(e) => detalhesUsuario(usuario.id)}>Detalhes</Button> </td>
                                </tr>
                            )
                        }
                    </tbody>
                ) : (
                    <tbody>
                        {status.type === 'error' ?
                            <tr>
                                <h6>
                                    {status.message}
                                </h6>
                            </tr>
                            : ""}
                    </tbody>
                )}

            </Table>
        </div>
    );
}