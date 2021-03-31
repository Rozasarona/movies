import React from 'react';
import 'antd/dist/antd.css';
import { Image } from 'antd';

function FilmCover({ backdrop_path }) {
  return (
    <Image
        width={183}
        src={`https://zos.alipayobjects.com/rmsportal?${ backdrop_path }`}
    />
  );
}

export default FilmCover;