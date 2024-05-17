// Welcome.js
import React from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "antd";
import "../css/index.css";

function Welcome() {
  const room = [
    {
      path: "/seckill-list",
      name: "list",
    },
    {
      path: "/set-seckill-key",
      name: "create",
    },
  ];

  return (
    <div>
      <div className="welcome-message">hello f32</div>
      <ul className="list-container">
        {room.map((msg, index) => (
          <li key={index} className="list-item">
            <Link
              to={msg.path}
              className="link"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <span className="list-item-name">{msg.name}</span>
              <span className="list-item-path">{msg.path}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Welcome;
