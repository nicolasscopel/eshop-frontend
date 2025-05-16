import { useState, useEffect } from 'react';
import CategoriaContext from './CategoriaContext';

import {
    getCategoriaPorCodigoAPI, getCategoriasAPI,
    cadastraCategoriaAPI, deleteCategoriaPorCodigoAPI
} from '../../../servicos/CategoriaServico';
import Tabela from './Tabela';
// importação do componente Tabela
import Formulario from './Formulario'
import Carregando from '../../comuns/Carregando';

// importação
import WithAuth from "../../../seguranca/WithAuth";
import { useNavigate } from 'react-router-dom';

function Categoria() {

    let navigate = useNavigate();

    const [alerta, setAlerta] = useState({ "status": "", message: "" });
    const [listaObjetos, setListaObjetos] = useState([]);
    // estado que controla a exibição da tela de carregamento
    const [carregando, setCarregando] = useState(true);


    const recuperaCategorias = async () => {
        try{

        setCarregando(true);
        setListaObjetos(await getCategoriasAPI());
        setCarregando(false);
        } catch (err){

            // tratamento para ir para a tela de login em caso de erro
            navigate("/login", { replace: true });
        }
    }

    const remover = async (codigo) => {
        if (window.confirm('Deseja remover esse objeto?')) {
            try{

            let retornoAPI = await deleteCategoriaPorCodigoAPI(codigo);
            setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
            recuperaCategorias();
            } catch(err) {
                // tratamento para ir para a tela de login em caso de erro
                 navigate("/login", { replace: true });
            }
        }

    }

    // novos estados e métodos
    const [editar, setEditar] = useState(false);

    const [exibirForm, setExibirForm] = useState(false);

    const [objeto, setObjeto] = useState({
        codigo: "", nome: ""
    })

    const novoObjeto = () => {
        try{ 
        setEditar(false);
        setAlerta({ status: "", message: "" });
        setObjeto({
            codigo: 0,
            nome: ""
        });
        setExibirForm(true);
    }catch(err) {
        // tratamento para ir para a tela de login em caso de erro
        navigate("/login", { replace: true });

    }
    }

    const editarObjeto = async codigo => {
        try{
        setObjeto(await getCategoriaPorCodigoAPI(codigo))
        setEditar(true);
        setAlerta({ status: "", message: "" });
        setExibirForm(true);
        } catch(err) {
            // tratamento para ir para a tela de login em caso de erro
            navigate("/login", { replace: true });
        }
    }

    const acaoCadastrar = async e => {
        e.preventDefault();
        const metodo = editar ? "PUT" : "POST";
        try {
            let retornoAPI = await cadastraCategoriaAPI(objeto, metodo);
            setAlerta({ status: retornoAPI.status, message: retornoAPI.message });
            setObjeto(retornoAPI.objeto);
            if (!editar) {
                setEditar(true);
            }
        } catch (err) {
            console.error(err.message);
            // tratamento para ir para a tela de login em caso de erro
            navigate("/login", { replace: true });
        }
        recuperaCategorias();
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setObjeto({ ...objeto, [name]: value });
    }

    

  



    useEffect(() => {
        recuperaCategorias();
    }, []);



    return (
        <CategoriaContext.Provider value={{
            alerta, listaObjetos, remover, objeto, editarObjeto,
            acaoCadastrar, handleChange, novoObjeto, exibirForm, setExibirForm
        }}>
            <Carregando carregando={carregando}>
            <Tabela />
            </Carregando>
            
            <Formulario />
        </CategoriaContext.Provider>
    )




}
export default WithAuth(Categoria);