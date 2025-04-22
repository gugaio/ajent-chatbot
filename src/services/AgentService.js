import {Squad} from "ajent";
import {CalcAgent} from "../ajents/CalcAgent";

class AgentService {
  constructor() {
    const agents = [new CalcAgent()];
    
    this.squadParams = {
      agents: agents,
      apiToken: import.meta.env.VITE_AJENT_API_TOKEN,
      apiUrl: 'http://localhost:5000/'
    };

    debugger;

    this.squad = new Squad(this.squadParams);
  }

  async sendMessage(content) {
    return await this.squad.send(content);
  }
}

export default AgentService; 