import React from "react";
import styles from "./style.module.css";

const BtnPrimaryModal = (props) => {
    const { btn_primary } = styles;

    return (
        <button type="button" className={`${btn_primary}  btn`} data-bs-toggle="modal" data-bs-target={`#${props.target}`}>
            {props.children}
        </button>
    );
};

export default BtnPrimaryModal;