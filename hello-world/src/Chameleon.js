import React from 'react';
import { Card, Image, Divider, Typography} from 'antd';
import st from './cards.scss';
import { DockerOutlined, GithubOutlined, JavaScriptOutlined, LinuxOutlined } from '@ant-design/icons';

const Chameleon = ({ width, src, height, }) => {
  return (<dv>
    <Divider />
    <Card
      title={
        <div>
          <a href="https://github.com/asankagit/quadtree/" className={st.githublogo} target="_blank">
            <img src="https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png" width="30px" className="githubico" />
            Chameleon - A lightweight image utility with shader support.
            <Typography> <a href="https://www.npmjs.com/package/@asanka-npm/chameleon" target="_blank">Checkout the NPM module</a></Typography>
          </a>
        </div>
      }
      extra={
        <a href="https://www.npmjs.com/package/@asanka-npm/chameleon" target="_blank">
          <svg height="20px" viewBox="0 0 27.23 27.23" aria-hidden="true"><rect fill="#333333" width="27.23" height="27.23" rx="2"></rect><polygon fill="#fff" points="5.8 21.75 13.66 21.75 13.67 9.98 17.59 9.98 17.58 21.76 21.51 21.76 21.52 6.06 5.82 6.04 5.8 21.75"></polygon></svg>
        </a>
      }
      style={{ width: "100%" }}
    >

      <div>
        <Image src="https://raw.githubusercontent.com/asankagit/quadtree/main/demo.png" />
      </div>
    </Card>

    <Divider />
    <Card title='Tech stack I love'>
      <DockerOutlined  style={{ fontSize: '25px', color: '#08c' ,padding: '20px'}} height={50}/>
      <GithubOutlined  style={{ fontSize: '25px', color: '#08c',padding: '20px' }}/>
      <JavaScriptOutlined  style={{ fontSize: '25px', color: '#08c',padding: '20px' }}/>
      <LinuxOutlined  style={{ fontSize: '25px', color: '#08c',padding: '20px' }}/>
    </Card>
  </dv>)

};

export {
  Chameleon
}