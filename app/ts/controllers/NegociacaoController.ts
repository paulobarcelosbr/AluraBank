import { NegociacoesView, MensagemView } from '../views/index';
import {  Negociacoes, Negociacao, NegociacaoParcial } from '../models/index';
import { domInject , throttle} from '../helpers/decoratos/index';
import { NegociacaoService } from '../services/index'

let timer = 0;

export class NegociacaoController{
    @domInject('#data')
    private _inputData: JQuery;
    @domInject('#quantidade')
    private _inputQuantidade: JQuery;
    @domInject('#valor')
    private _inputValor: JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');
    private _negociacaoService = new NegociacaoService();
    constructor(){
        this._negociacoesView.update(this._negociacoes);
    }
    @throttle()
    adiciona(event:Event):void{

        event.preventDefault();

        let data = new Date(this._inputData.val().replace(/-/g,','));
        if(!this._ehDiaUtil(data)){
            this._mensagemView.update('Somente negociações em dias úteis.');
            return
        }
        
        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );
        this._negociacoes.adiciona(negociacao);
        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }
    private _ehDiaUtil(date:Date){
        return date.getDay() != DiaDaSemana.Sabado && date.getDay() != DiaDaSemana.Domingo;
    }
    @throttle()
    importaDados(){

        this._negociacaoService
        .obterNegociacoes(res => {
            if(res.ok){

                return res;

            }else{

                throw new Error(res.statusText);
            }
        })
        .then((negociacoes:Negociacao[]) => {
            negociacoes.forEach(negociacao => 
                this._negociacoes.adiciona(negociacao));
            this._negociacoesView.update(this._negociacoes);
        }); 

    }
} 

enum DiaDaSemana{
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}