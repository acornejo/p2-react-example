import React from 'react';
import './style.css';

const HelloWorld = ({ name }) => (
  <div className="hello">Hello {name}!</div>
);

HelloWorld.propTypes = {
  name: React.PropTypes.string.isRequired,
};

export default HelloWorld;
