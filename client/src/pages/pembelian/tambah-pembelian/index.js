import React, { useEffect, useState } from "react";
import { url } from "../../../api";
import styles from "../style.module.css";

import BtnPrimary from "../../../components/button/primary";
import { H3, H4, H5, H6 } from "../../../components/typography/heading";
import Subtitle from "../../../components/typography/subtitle";
import { Title } from "../../../components/typography/title";
import { SupplierInputSelect } from "../../../components/form/select";
import LinkSpan from "../../../components/typography/link";
import Checkbox from "../../../components/checkbox";
import InputText from "../../../components/form/text";
import DisableForm from "../../../components/form/disable";
import Spinner from "../../../components/spinner";
import Divider from "../../../components/divider";
import P from "../../../components/typography/paragraph";
import BtnSecondary from "../../../components/button/secondary";
import { useNavigate } from "react-router-dom";

const TambahPembelian = () => {
    const navigate = useNavigate();

    const [produk, setProduk] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [statusNoNota, setStatusNoNota] = useState(false);

    const [barangMasuk, setBarangMasuk] = useState([]);
    const [idSupplier, setIdSupplier] = useState(null);
    const [noNota, setNoNota] = useState(null);

    const numberWithCommas = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const tambahJumlahBarang = (produk) => {
        const barangAdaDiDaftar = barangMasuk.find((x) => x._id === produk._id);
        if (barangAdaDiDaftar) {
            setBarangMasuk(barangMasuk.map((x) => (x._id === produk._id ? { ...barangAdaDiDaftar, jumlahMasuk: barangAdaDiDaftar.jumlahMasuk + 1 } : x)));
        } else {
            setBarangMasuk([...barangMasuk, { ...produk, jumlahMasuk: 1 }]);
        }
    };

    const kurangJumlahBarang = (produk) => {
        const barangAdaDiDaftar = barangMasuk.find((x) => x._id === produk._id);
        if (barangAdaDiDaftar.jumlahMasuk === 1) {
            setBarangMasuk(barangMasuk.filter((x) => x._id !== produk._id));
        } else {
            setBarangMasuk(barangMasuk.map((x) => (x._id === produk._id ? { ...barangAdaDiDaftar, jumlahMasuk: barangAdaDiDaftar.jumlahMasuk - 1 } : x)));
        }
    };

    const totalHarga = barangMasuk.reduce((previous, current) => previous + current.jumlahMasuk * current.harga, 0);

    const getProduk = () => {
        url.get("/produk")
            .then((response) => {
                setProduk(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const getSupplier = () => {
        url.get("/supplier")
            .then((response) => {
                setSupplier(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    const postPembelian = () => {
        url.post("tambah-pembelian", {
            barangMasuk: barangMasuk.map((x) => ({ id_produk: x._id, jumlahMasuk: Number(x.jumlahMasuk) })),
            totalHarga: Number(totalHarga),
            id_supplier: idSupplier,
            noNota: noNota !== null ? `NOTA#${noNota}` : undefined,
        })
            .then((response) => {})
            .catch((error) => {
                console.log(error.message);
            })
            .finally(() => {
                setTimeout(() => {
                    handleClear();
                    navigate("/pembelian");
                }, 100);
            });
    };

    const patchBarangMasuk = (id, jumlahMasuk) => {
        url.patch(`/stok-barang/barang-masuk/${id}`, {
            jumlahMasuk,
        })
            .then((response) => {})
            .catch((error) => {
                console.log(error.message);
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        postPembelian();

        barangMasuk.map((x) => {
            return patchBarangMasuk(x._id, x.jumlahMasuk);
        });
    };

    const handleClear = () => {
        setBarangMasuk([]);
        setNoNota(null);
        setIdSupplier(null);
    };

    const handleBackToPrevious = () => {
        navigate(-1);
    };

    useEffect(() => {
        getProduk();
        getSupplier();
    }, []);

    return (
        <>
            {produk === null ? (
                <Spinner />
            ) : (
                <div className="row">
                    <div className="col-7">
                        <div className="row">
                            {produk.map((x) => {
                                return (
                                    <div className="col-4 mb-3" key={x._id}>
                                        <div className="card p-3 h-100 d-flex flex-column justify-content-between">
                                            <div className="d-flex justify-content-center">
                                                <img src={`data:image/png;base64, ${x.gambar}`} alt={x.nama} className={`${styles.product_picture_list} mb-2`} />
                                            </div>
                                            <div>
                                                <H6 className={`text-justify mb-2`}>{x.nama}</H6>
                                            </div>
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between">
                                                    <Subtitle fontsize="0.75rem">Jumlah Stok :</Subtitle>
                                                    <Subtitle fontsize="0.75rem">
                                                        {x.stok.total} {x.id_satuanbarang[0].nama}
                                                    </Subtitle>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <Subtitle fontsize="0.75rem" lineheight="5px">
                                                        Harga :
                                                    </Subtitle>
                                                    <Subtitle fontsize="0.75rem" lineheight="5px">
                                                        Rp {numberWithCommas(x.harga)}
                                                    </Subtitle>
                                                </div>
                                            </div>
                                            <BtnPrimary type="button" onClick={() => tambahJumlahBarang(x)}>
                                                Pilih
                                            </BtnPrimary>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="col">
                        <div className={`${styles.list_wrapper}`}>
                            <H4 margin="0 0 32px 0">Daftar Barang Pembelian</H4>
                            {barangMasuk.length === 0 && (
                                <div className="d-flex justify-content-center align-items-center p-5">
                                    <P texttransform="uppercase">Belum ada pembelian</P>
                                </div>
                            )}
                            {barangMasuk.map((x) => {
                                return (
                                    <div className="card border-0" style={{ backgroundColor: "#f9fafb" }} key={x._id}>
                                        <div className="p-3 d-flex">
                                            <div className="align-self-center me-3">
                                                <img src={`data:image/png;base64, ${x.gambar}`} alt={x.nama} className={styles.product_picture_order} />
                                            </div>
                                            <div className="text-uppercase align-self-center w-100">
                                                <H5 className="mb-1">{x.nama}</H5>
                                                <div className="d-flex justify-content-between">
                                                    <Subtitle fontsize="1rem">Rp {numberWithCommas(x.harga)}</Subtitle>
                                                    <div className="d-flex">
                                                        <BtnSecondary type="button" bs="px-1 py-0" onClick={() => kurangJumlahBarang(x)}>
                                                            {" "}
                                                            -{" "}
                                                        </BtnSecondary>
                                                        <Subtitle margin="0 1rem" fontsize="1rem" fontweight="600" color="#111928">
                                                            {x.jumlahMasuk}
                                                        </Subtitle>
                                                        <BtnSecondary type="button" bs="px-1 py-0" onClick={() => tambahJumlahBarang(x)}>
                                                            {" "}
                                                            +{" "}
                                                        </BtnSecondary>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {barangMasuk.length !== 0 && (
                                <>
                                    <Divider margin="2rem 0" />
                                    <div className="d-flex justify-content-between align-items-center">
                                        <P>Total</P>
                                        <H3>Rp {numberWithCommas(totalHarga)}</H3>
                                    </div>
                                </>
                            )}
                            <Divider margin="2rem 0" />
                            <form onSubmit={handleSubmit}>
                                <label htmlFor="InputNoNota">
                                    <Title margin="0 0 0.625rem 0.25rem">Nomor Nota</Title>
                                </label>
                                {statusNoNota === false ? <InputText required defaultValue={noNota} onChange={(e) => setNoNota(e.target.value)} /> : <DisableForm type="text" />}
                                <Checkbox label="Isi nomor nota secara otomatis" id="noNota" onClick={() => setStatusNoNota(!statusNoNota)} />
                                <label htmlFor="SelectIdMerek">
                                    <Title margin="1rem 0 0.625rem 0">Supplier</Title>
                                </label>
                                <SupplierInputSelect data={supplier} bs="mb-1" defaultValue={idSupplier} onChange={(e) => setIdSupplier(e.target.value)} required />
                                <Subtitle fontsize="0.75rem" margin="0 0 1rem 0.25rem">
                                    *Jika supplier tidak ditemukan, maka pergi ke halaman 'Supplier' atau klik{" "}
                                    <LinkSpan fontsize="0.75rem" to="/supplier/tambah-supplier">
                                        disini
                                    </LinkSpan>
                                </Subtitle>
                                <BtnPrimary type="submit" value="Simpan" bs="w-100 mb-2" disabled={barangMasuk.length === 0 ? true : false} />
                                <BtnSecondary type="button" bs="w-100" onClick={handleBackToPrevious}>
                                    Kembali
                                </BtnSecondary>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TambahPembelian;
