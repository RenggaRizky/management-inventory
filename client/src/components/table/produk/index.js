import React, { useState } from "react";
import styles from "./style.module.css";

import { HiOutlinePencilAlt } from "react-icons/hi";

import BtnLinkSuccess from "../../button/link/success";
import ModalDelete from "../../button/modal/delete";
import { H5, H6 } from "../../typography/heading";
import P from "../../typography/paragraph";
import Subtitle from "../../typography/subtitle";
import { Link } from "react-router-dom";

const TableProduk = ({ tableheaddata, tablebodydata, setproduk, ...props }) => {
    const [currentId, setCurrentId] = useState(null);
    return (
        <table className={`${styles.table} table`}>
            <thead className={styles.table_head}>
                <tr className="align-middle">
                    {tableheaddata.map((data) => {
                        return (
                            <th scope="col" key={data.key} className="text-uppercase" style={{ width: data.width }}>
                                <H6 color="#6B7280">{data.title}</H6>
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody className={styles.table_body}>
                {tablebodydata.map((data, index) => {
                    return (
                        <tr key={data._id} className="align-middle">
                            <td className="text-capitalize">
                                <P color="#616161">{index + 1}</P>
                            </td>
                            <td>
                                <H5 color="#616161" fontweight="600" className="text-uppercase">
                                    {data.nama}
                                </H5>
                                <Subtitle>{`Dimensi ${data.dimensi.panjang.$numberDecimal} x ${data.dimensi.lebar.$numberDecimal} x ${data.dimensi.tinggi.$numberDecimal}`}</Subtitle>
                            </td>
                            <td className="text-capitalize">
                                <P color="#616161">{data.id_jenisbarang[0].nama}</P>
                            </td>
                            <td className="text-capitalize">
                                <P color="#616161">{data.id_merek[0].nama}</P>
                            </td>
                            <td className="text-capitalize">
                                <P color="#616161">{data.harga.hargaSatuan}</P>
                            </td>
                            <td className="text-capitalize">
                                <P color="#616161">{data.harga.hargaPerLusin}</P>
                            </td>
                            <td className="text-capitalize">
                                <P color="#616161">{data.volume.$numberDecimal}</P>
                            </td>
                            <td>
                                <div className="d-flex justify-content-end">
                                    <Link to="edit-produk" state={{ id: data._id }} className="text-decoration-none d-flex align-items-center">
                                        <BtnLinkSuccess bs="text-uppercase d-flex border-0 align-items-center">
                                            <HiOutlinePencilAlt className={styles.icon_edit} />
                                            Edit
                                        </BtnLinkSuccess>
                                    </Link>
                                    <ModalDelete value="Hapus" page="Produk" target="hapusProduk" currentid={currentId} setcurrentid={() => setCurrentId(data._id)} setdata={setproduk} deleteurl={"produk"} />
                                </div>
                                <Subtitle></Subtitle>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default TableProduk;
