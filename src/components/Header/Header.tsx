import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FlexBox, Spacer } from '../atoms';

export const Header: React.VFC = React.memo(() => {
  const navigate = useNavigate();

  return (
    <FlexBox>
      <Spacer axis="horizontal" size="md" />
      <h1 className="text-lg w-1/6">GBAC.js</h1>
      <div className="w-5/6"></div>
      <FlexBox className="justify-items-end">
        <div
          onClick={() => {
            navigate('/GBAC.js/bpp');
          }}
        >
          4Bpp
        </div>
        <Spacer axis="horizontal" size="md" />
        <div
          onClick={() => {
            navigate('/GBAC.js/lz77');
          }}
        >
          LZ77
        </div>
        <Spacer axis="horizontal" size="md" />
      </FlexBox>
    </FlexBox>
  );
});
