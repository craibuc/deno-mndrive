export class MnDrive {

  private authorization: string;
  private base_uri: string;

  constructor (
    server: 'Testing'|'Staging'|'Production', 
    username: string, 
    password: string
  ) {

    this.authorization = `Basic ${ btoa(`${username}:${password}`) }`

    let subdomain = "mndrive-agent";
    let path = "MCP";
  
    switch (server) {
      case "Testing":
        subdomain = "mndrivewstest";
        path = "RDT";
        break;
      case "Staging":
        subdomain = "qa-mndrive-agent";
        path = "RDS";
        break;
      case "Production":
        subdomain = "mndrive-agent";
        path = "MCP";
        break;
      default:
        subdomain = "mndrive-agent";
        path = "MCP";
    }

    this.base_uri = `https://${subdomain}.dvs.dps.mn.gov/${path}`
    console.log('base_uri',this.base_uri)

  }
      
  get_account_status = async () => {
    
      const url = `${this.base_uri}/Services/Maintenance/Rest/ExpirationCheck`;
      console.log("url", url);
      
      return await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: this.authorization,
        },
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`${response.statusText} [${response.status}]`);
        }
        return response.json();
      })
      .then((data)=> data);
  
  }

  get_license = async (
    license: string
  ) => {
    
    const url = `${this.base_uri}/Services/RecordRequest/v1/Search`;
    console.log("url", url);
    
    return await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: this.authorization,
          'Content-Type': "application/json",
        },
        body: JSON.stringify({
          "dln": `${license}`,
        }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`${response.statusText} [${response.status}]`);
      }
      return response.json();
    })
    .then((data)=> data);

  }
  
}