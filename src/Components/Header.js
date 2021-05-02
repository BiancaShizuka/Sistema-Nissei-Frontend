import history from '../history'
import React from 'react';
import './Header.css'
function Header(){
    function voltarTela(){
        localStorage.removeItem('cod_cli');
        localStorage.removeItem('cod_fun');
        localStorage.removeItem('cod_ser');
        localStorage.removeItem('car_id');
        history.push('/home');
    }
    function logout(){
        localStorage.clear()
        history.push('/');
    }
    function alterarPerfil(){
        localStorage.setItem('cod_fun',localStorage.getItem('cod_user'));

        history.push('/cadastroFuncionario');
    }
    return(
    <header class='header'>
        <button type="button" class='button-inicio' onClick={voltarTela}>Nissei</button>
        <div class="divHeader">
            <button type="button" onClick={logout} class="button-logout">Sair</button>
            <button type="button" onClick={alterarPerfil} class="button-logout">Alterar perfil</button>
        </div>
    </header>
    );
}
export default Header;