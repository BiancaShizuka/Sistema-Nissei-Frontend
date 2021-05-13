import api from '../../servicos/api';
import React,{useState,useEffect} from 'react';
import ReactLoading from 'react-loading';
import history from '../../history'
import './cadastroServiços.css'
import '../../app.css'
import Header from '../../Components/Header'
function CadastroServicos(){
    const [carro,setCarro]=useState('');
    const [carros,setCarros]=useState([]);
    const [descricao,setDescricao]=useState('');
    const [dtInicio,setDtInicio]=useState('');
    const [maoObra,setMaoObra]=useState('0');
    const [pecs,setPecs]=useState([]);
    const [func,setFunc]=useState('');
    const [funcs,setFuncs]=useState([]);

    const [pecsUti,setPecsUti]=useState([]);
    const [quant,setQuant]=useState('');
    const [valorUni,setValorUni]=useState('');
    const [peca,setPeca]=useState('');
    const [pecsExc,setPecsExc]=useState([]);

    const [button,setButton]=useState('Salvar');
    const [titulo,setTitulo]=useState('Cadastro de serviço');
    const [loading,setLoading]=useState(false);
    async function listarCarros(){
        const resp=await api.get(`/clienteCod/${localStorage.getItem('cod_cli')}`)
            setCarros(resp.data.carros);
        
    }
    
    async function listarPecas(){
        await api.get(`/pecafiltro/${peca}`).then((resp)=>{
            setPecs(resp.data);
        });
    }

    async function listarFuncionarios(){
        await api.get(`/func`).then((resp)=>{
            setFuncs(resp.data);
        });
    }

    useEffect(()=>{
        listarFuncionarios();
        listarCarros();
        if(localStorage.getItem('cod_ser')!==null){
            alterarServico();
            setButton("Alterar");
            setTitulo("Alterar Serviço");
        }
    },[]);

    useEffect(()=>{
        if(peca.length>=3){
            listarPecas();
        }
    
    },[peca])

    async function alterarServico(){
        setLoading(true);
        var pecsAux = pecsUti;

        setPecsUti([]);
        const resp=await api.get(`/servico/${localStorage.getItem('cod_ser')}`)
            if(resp.data.carro===null)
                setCarro("");
            else{
                setCarro(resp.data.carro.car_id);
            }
            setDescricao(resp.data.ser_descricao);
            if(resp.data.funcionario!==null)
                setFunc(resp.data.funcionario.pes_cod);
            else
                setFunc("");
            setMaoObra(resp.data.ser_maoObra);

            var date=new Date(resp.data.ser_inicio);
            var dat=date.getFullYear()+"-";
            if(date.getMonth()+1<10)
                dat+='0';
            dat+=(date.getMonth()+1)+"-";
            if(date.getDate()<10)
                dat+='0';
            dat+=date.getDate();
            setDtInicio(dat);
        
            var i=0;
            while(i<resp.data.pecas.length){
                var data= {
                    cod:i,
                    banco:1,//Saber que essa peça do serviço já está no banco
                    uti_qtde:resp.data.pecas[i].uti_qtde,
                    uti_precoUni: resp.data.pecas[i].uti_precoUni.toFixed(2),
                    pec_desc:resp.data.pecas[i].peca.pec_descricao,
                    pec_cod:resp.data.pecas[i].peca.pec_cod
                };
                pecsAux.push(data);
                i=i+1;
            }
            setPecsUti(pecsAux);
            setLoading(false);
    }
    
    async function Excluir(codigo)
    {
        var i=0;
        while(i<pecsUti.length && pecsUti[i].cod!==codigo){
            i++;
        }
        let pecsAux=pecsExc;
        if(pecsUti[i].banco===1){
            pecsAux.push(pecsUti[i]);
            setPecsExc(pecsAux);
            //await api.delete(`/servicopeca/${localStorage.getItem('cod_ser')}/${pecsUti[i].pec_cod}`);
        }
        setPecsUti(pecsUti.filter(pecsUti=>pecsUti.cod!==codigo));
    }
    function ValidarCampos(){
        var test = true;
        let mensagem = document.querySelector("#mensagem");
        mensagem.innerHTML="";
        if(vazio(carro)){
            mensagem.innerHTML+="<p>Carro não foi selecionada</p>"
            test=false;
        }
        if(vazio(func)){
            mensagem.innerHTML+="<p>Funcionário não foi selecionada</p>";
            test=false;
        }
        
        return test;
    }
    async function cadastrarServico(e){
        setLoading(true);
        e.preventDefault();
  
        if(ValidarCampos()){
            if(button==='Salvar'){
               await api.post('/servico',{
                    car_id:carro,
                    fun_cod:func,
                    cli_cod:localStorage.getItem('cod_cli'),
                    ser_descricao:descricao,
                    ser_maoObra:maoObra,
                    ser_inicio:dtInicio,
                    pecas:pecsUti,
                    ser_status:true
                })
                
                alert('Serviço Cadastrado');
                history.goBack();
            }
            else{
                await api.put('/servico',{
                    ser_cod:localStorage.getItem('cod_ser'),
                    car_id:carro,
                    fun_cod:func,
                    ser_descricao:descricao,
                    ser_maoObra:maoObra,
                    ser_inicio:dtInicio,
                    pecas:pecsUti,
                    pecasExc:pecsExc,
                    ser_status:true
                })
                alert('Serviço Alterado');
                localStorage.removeItem("cod_ser");
                history.goBack();
            }
        }
        setLoading(false);
    }

    async function addLista(){
        let mensagem = document.querySelector("#mensagemPecas");
        mensagem.innerHTML="";
        var tam;
        
        if(valorPositivo(quant) && valorPositivo(valorUni) && !vazio(peca)){
            var i=0;
            while(i<pecs.length && pecs[i].pec_descricao.toUpperCase()!==peca.toUpperCase())
                i++;

            if(i===pecs.length)
            {
                mensagem.innerHTML="<p>Peça não cadastrada</p>"
            }
            else
            {
                var k=0;
                while(k<pecsUti.length && peca.toUpperCase()!==pecsUti[k].pec_desc.toUpperCase())
                    k++;
                if(k<pecsUti.length){
                    mensagem.innerHTML="<p>Peça já foi registrada. Exclua e coloque novamente</p>"
                }
                else
                {
                    if(pecsUti.length===0)
                        tam=1;
                    else
                        tam=pecsUti[pecsUti.length-1].cod+1;

                    const data= {
                        cod:tam,
                        banco:0, //Saber que essa peça nesse serviço não está no banco
                        uti_qtde:quant,
                        uti_precoUni: valorUni,
                        pec_desc:pecs[i].pec_descricao,
                        pec_cod:pecs[i].pec_cod
                    };
                    setQuant('');
                    setValorUni('');
                    setPeca('');
                    setPecsUti([...pecsUti, data]);
                    mensagem.innerHTML="";
                }
            }
        }
        else{
            if(!valorPositivo(quant))
                mensagem.innerHTML+="<p>Quantidade com valor inválido</p>";
            if(!valorPositivo(valorUni))
                mensagem.innerHTML+="<p>Valor unitário com valor inválido</p>";
            if(vazio(peca))
                mensagem.innerHTML+="<p>Nenhuma peça selecionada</p>";
        }
        
    }

    async function addPeca(e){
        e.preventDefault();
        var pecsAux = pecs;
        
        if(!vazio(peca)){
            var i=0;
            while(i<pecs.length && pecs[i].pec_descricao.toUpperCase()!==peca.toUpperCase())
                i++;
            if(i===pecs.length){
                setPecs([]);
                const response=await api.post('/peca',{
                    pec_descricao: peca,
                })
                pecsAux.push(response.data[0])
                setPecs(pecsAux);
                alert("Nova peça adicionada");
            }else{
                alert("Peça já registrada");
            }
        }
    }
    
    function valorPositivo(valor)
    {
        if(valor<=0)
            return false;
        else   
            return true;
    }

    function vazio(valor)
    {
        let v=''+valor;
        if(v.length<=0)
            return true;
        return false;
    }

    function voltar(){
        localStorage.removeItem("cod_ser");
        history.goBack();
    }
    return(
        <div id="tela" className="background">   
            <Header/> 
            <aside className="div-servico">
                <h1>{titulo}</h1>
                <form className='formularioServico' onSubmit={cadastrarServico}>
                    <div className="input-block block-data" >
                        <label htmlFor="dtInicio">Data de inicio: </label>
                        <input type="date" name="dtInicio" id="dtInicio" value={dtInicio} onChange={e=>setDtInicio(e.target.value)} required/>
                    </div>

                    <div className="input-block block-carro">
                        <label>Carro: </label>
                        <select className="select-carro" value={carro} onChange={e=>setCarro(e.target.value)}>
                                <option id="op-selecione" value="">
                                    Selecione uma opcao
                                </option>
                                {carros.map(car=>(
                                    <option key={car.car_id} value={car.car_id}>
                                        {car.car_placa} {car.car_modelo}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="input-block block-func">
                        <label>Funcionário: </label>
                        <select className="select-func" value={func} onChange={e=>setFunc(e.target.value)}>
                                <option id="op-selecione" value="">
                                    Selecione uma opcao
                                </option>
                                {funcs.map(fun=>(
                                    <option key={fun.pes_cod} value={fun.pes_cod}>
                                        {fun.pes_nome}
                                    </option>
                                ))}
                        </select>
                    </div>
                    
                    <div className="input-block block-maoObra" >
                        <label htmlFor="maoObra">Valor Mão de Obra: </label>
                        <input type="number" step="0.01" name="maoObra" id="maoObra" value={maoObra} onChange={e=>setMaoObra(e.target.value)} required/>
                    </div>

                    <div className="input-block block-desc">
                        <label htmlFor="descricao">Descrição</label>
                        <textarea name="descricao" className="txtArea" rows="10" cols="110" id="descricao" value={descricao} onChange={e=>setDescricao(e.target.value)} required></textarea>
                    </div>

                    <h1 className="tituloPecas">Adicionar peças Utilizadas</h1>
                    <div className="cadastroPecas">
                        <div className="input-block block-quant">
                            <label htmlFor="quant">Qtde:</label>
                            <input type="number" name="quant" id="quant" value={quant} onChange={e=>setQuant(e.target.value)} />
                        </div>

                        <div className="input-block block-valorUni">
                            <label htmlFor="valorUni">Valor Uni:</label>
                            <input type="number" step="0.01" name="valorUni" id="valorUni" value={valorUni} onChange={e=>setValorUni(e.target.value)} />
                        </div>
                        {pecs && (
                            <div className="input-block block-peca">
                                <label>Peça: </label>
                                <input type="text" autoComplete="off" name="peca" list="pecanome" className="select-peca" value={peca} placeholder="Digite pelo menos 3 letras" onChange={e=>setPeca(e.target.value)}/>
                                    <datalist id="pecanome">
                                        {pecs.map(pec=>(
                                            <option key={pec.pec_cod} value={pec.pec_descricao}></option>
                                        ))}
                                    </datalist>
                            </div>
                        )}
                        <div className="divAdicionarPec">
                            <button className="btnAdicionarPec" onClick={addPeca}>+</button>
                        </div>
                        <div id="mensagemPecas" className="mensagem">

                        </div>
                        <button type="button" onClick={addLista} className="btnFormPecas">Adicionar Peças</button>
                    </div>         
                    <div id="divTable">
                        <table id="tabelaCont">
                            <thead>
                                <tr>
                                    <td>Quant</td>
                                    <td>Valor Uni.</td>
                                    <td>Descrição</td>
                                    <td>Excluir</td>
                                </tr>
                            </thead>
                            <tbody>
                                {pecsUti.map(pec=>(
                                    <tr key={pec.cod}>
                                        <td>{pec.uti_qtde}</td>
                                        <td>R$ {pec.uti_precoUni}</td>
                                        <td>{pec.pec_desc}</td>
                                        <td>
                                            <button id="btexcluir" className="btnExcluirPec" onClick={()=>Excluir(pec.cod)} type="button">
                                            Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div id="mensagem">

                    </div> 
                    <button type="submit" className="btnFormSalvar">{button}</button>
                </form>
                <button type="button" onClick={voltar}>Voltar</button>
            </aside>
            {loading &&
                <div className="modalSer">
                    
                    <ReactLoading type={"spinningBubbles"} color={"#ffffff"} height={'20%'} width={'20%'} />
                </div>
            }
        </div>
    );
}
export default CadastroServicos;