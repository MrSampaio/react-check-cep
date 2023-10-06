import { BiSearchAlt } from "react-icons/bi";
import React from "react";
import { useState } from "react";
import api from "./services/CepApi";
import "../src/static/styleApp.css";
import Loading from "./components/loader.js";
import Topic from "./components/SpanList";

function App() {
  let [input, setInput] = useState(""); // define estado do input como vazio e recebe valor digitado
  let [cepInfos, setCEP] = useState({}); // define valor da variável como vazio e recebe objeto com retorno da api
  let [err, setErr] = useState(""); // define variávelo de erro com vazio para receber erros de validações e imprimir na tela
  let [loading, setLoading] = useState(false); // setando variável loading como falso

  const handleClickEnter = (event) => { // prevenção de clique no Enter e reload da página
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  };

  async function submit() { // função assíncrona de envio que aguarda resposta da api

    setLoading(true); // página de carregamento

    let cleanCEP = input.replace(/\D/g, ""); // removendo caracteres não numéricos digitados

    if (cleanCEP.length <= 7) { // testando quantidade de números digitados
      setLoading(false);
      setErr("Insira um cep válido!");
      setCEP("");
      return;
    }

    try {
      
      // aguardando retorno da api e setando json em novo objeto
      const response = await api.get(`${cleanCEP}/json`);
      setCEP(response.data);

      if (response.data.erro) {
        // verificando se há erro ao consultar valor inserido
        setLoading(false);
        setErr("Cep inexistente, verifique-o ou insira um cep válido!");
        setCEP("");
        return;
      } else if (!response.data.erro) {
        // verificando se não há erro e limpando variáveis para retornar informações
        setLoading(false);
        setInput("");
        setErr("");
      }
    } catch (error) { // catch com parâmetro de erro para ser exibido
      setLoading(false);
      setErr("Erro ao consultar cep: " + error);
      setCEP("");
    }
  }
  return (

    <body className="container">
      <form>
        <div className="title">
          <h2>Consulta de cep</h2>
          <p>Insira no campo abaixo o cep a ser consultado:</p>
        </div>

        <div className="input-box">
          <button className="input-button">
            <BiSearchAlt className="icon" size={30} />
          </button>

          <input
            id="input"
            minLength={8}
            maxLength={8}
            required
            type="text"
            placeholder="Digite o cep (xxxxxxxx)"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={handleClickEnter}
          />
        </div>

        {err !== "" ? (
          <div className="error-box">
            <span className="error">{err}</span>
          </div>
        ) : (
          ""
        )}

        <div>
          <button className="button" type="button" onClick={submit}>
            Consultar CEP
          </button>
        </div>
      </form>

      {Object.keys(cepInfos).length > 1 && (
        <section className="infos-container">
          <h2 className="infos-title">
            CEP: <strong className="list-icon">{cepInfos.cep}</strong>
          </h2>
          <div className="infos-box">

            <Topic
              Strongclass="list-icon"
              StrongText="Logradouro: "
              PCLass="info"
              PText={cepInfos.logradouro}
            />

            <Topic
              Strongclass="list-icon"
              StrongText="Bairro: "
              PCLass="info"
              PText={cepInfos.bairro}
            />
            <Topic
              Strongclass="list-icon"
              StrongText="Estado: "
              PCLass="info"
              PText={cepInfos.localidade}
            />
            <Topic
              Strongclass="list-icon"
              StrongText="UF: "
              PCLass="info"
              PText={cepInfos.uf}
            />
            <Topic
              Strongclass="list-icon"
              StrongText="DDD: "
              PCLass="info"
              PText={cepInfos.ddd}
            />

          </div>
        </section>
      )}
      {loading && <Loading />} {/* ícone de carregamento */}
    </body>
  );
}

export default App;
