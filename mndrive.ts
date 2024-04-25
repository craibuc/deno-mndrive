export class MnDrive {

  private authorization: string;
  public base_uri: string;

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
      // console.log("url", url);
      
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
    // console.log("url", url);
    
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

  set_password = async (
    newpassword: string
  ) => {
  
    const url = `${this.base_uri}/Services/Maintenance/Rest/ChangePassword`;
    // console.log("url", url);
    
    return await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: this.authorization,
        'Content-Type': "application/json",
      },
      body: JSON.stringify({
        "newpassword": `${newpassword}`,
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

  generate_password = () => {
    /**
     * @param {number} length Length of the password.
     * @param {string} wishlist List of characters to be used in the password.
     * @returns {string} The password
     */
    const generatePassword = (
        length: number = 20,
        wishlist: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@$%*()?:;{}+-~",
    ) =>
      /*
      array of 20 random numbers
      x % wishlist.length: produces a value between 0 and length-1
      wishlist[x % wishlist.length]): gets the character with that index
      */
      Array.from(crypto.getRandomValues(new Uint32Array(length)))
        .map((x) => wishlist[x % wishlist.length])
        .join("");
  
    /*
    ^ - beginning of line
    (?!.*[&<>]) - none of these characters
    (?=.*\d) - one number
    (?=.*[a-z]) - one, lower-case letter
    (?=.*[A-Z]) - one, upper-case letter
    (?=.*[!@$%*()?:;{}\+\-~]) - one, special character
    .{14,28} - match 14 to 28 times
    $ - end of line
    */
    const re = /^(?!.*[&<>])(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@$%*()?:;{}\+\-~]).{14,28}$/g;
  
    let matched = false
    let password = null
  
    // min and max included 
    const randomIntFromInterval = (min: number, max: number): number  => Math.floor(Math.random() * (max - min + 1) + min);
    
    do {
  
      password = generatePassword( randomIntFromInterval(14,28) )
      console.log('password',password)
  
      matched = re.test(password);
      console.log('matched',matched)
  
      if (matched) { break; }
  
    } while ( matched === false );
  
    return {
        Password: password
    };
  
  }

}