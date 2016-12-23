import './style/index.css';
import {Login} from "./scripts/Componets/Login";

const param = {userName: '用户名', pass: '密码', login: '登录'};
const login = new Login(param);

document.getElementById('root').innerHTML = login.render();
document.getElementById('root').innerHTML += `<br/>昨日黄土送白骨,今宵红灯帐底卧鸳鸯，金满箱，银满箱，
<span class="no-select">你选我试试</span> 如何两鬓又成霜？`;