import { Agent, Tool } from 'ajent';

export class CalcAgent extends Agent {
    constructor() {
        super("calc_agent", "Agente financeiro para cálculos e informações financeiras sobre selic");
        this.addTool(new Tool('selic', "Calcula o valor de uma taxa da selic, é preciso informar a taxa como parametro", this.selic)); 
        this.addTool(new Tool('cdi', "Calcula o valor da taxa CDI, é preciso informar a taxa como parametro", this.cdi));
    }

    instruction = () => {
        return "Your custom instructions here";
    }

    selic(taxa) {
        // Tool implementation
        return "Selic final é xxx + " + taxa;
    }

    cdi(taxa) {
        // Tool implementation
        return "CDI final é xxx + " + taxa;
    }
}