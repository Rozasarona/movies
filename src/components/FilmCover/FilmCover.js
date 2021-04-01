import React from 'react';
import 'antd/dist/antd.css';
import { Image } from 'antd';

function FilmCover({ poster_path, configuration }) {
  const latest_poster_size_index = configuration.images.poster_sizes.length - 1;
  const poster_size_original = configuration.images.poster_sizes[latest_poster_size_index];
  const url = `${configuration.images.base_url}${poster_size_original}${poster_path}`
  return (
    <Image
        width={183}
        height={281}
        src={ url }
    />
  );
}

export default FilmCover;