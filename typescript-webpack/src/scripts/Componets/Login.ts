interface ILogin {
  userName: string;
  pass: string;
  login: string;
}
class Login {
  constructor(public params: ILogin = {userName: 'userName', pass: 'pass', login: 'login'}) {
  }

  render() {
    return `<div>
      <div><label for="">${this.params.userName}<input type="text"></label></div>
      <div><label for="">${this.params.pass}<input type="password"></label></div>
      <div><button>${this.params.login}</button></div>
    </div>`;
  }
}

export {Login};