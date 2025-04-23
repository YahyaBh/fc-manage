import React, { useEffect, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { IoIosAdd } from "react-icons/io";
import { Switch } from '@mui/material';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import dashboardIcon from '../../../assets/dashboard/dashboard_icon.png'


import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { PencilRuler } from 'lucide-react';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const breadcrumbs = [
    {
        title: 'Famille',
        href: '/category',
    },
];

dayjs.extend(relativeTime);

export default function Category() {
    const { auth, categories } = usePage().props;



    const [selected, setSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);


    const [category, setCategory] = useState({});

    const { data, setData, post, processing, errors, reset } = useForm({
        intitule: '',
        status: 1,
        user_id: auth.user.id,
    });

    const moadlControl = () => setIsModalOpen((v) => !v);
    const modalEditControl = () => setIsModalEditOpen((v) => !v);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (newStatus) => {
        setData((prev) => ({ ...prev, status: newStatus === true ? 1 : 0 }));
    };

    const handleInputChangeEdit = (e) => {
        const { name, value } = e.target;
        setCategory((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddCategory = (e) => {
        e.preventDefault();

        if (!data.intitule) {
            toast.error('Veuillez remplir le nom de la catégorie');
            return;
        }

        post('/famille/add', {
            data,
            onSuccess: (page) => {
                moadlControl();
                reset();

                console.log(page);


                if (page?.props?.flash?.error) {
                    toast.error(page?.props?.flash.error);
                } else if (page?.props?.flash?.message) {
                    toast.success(page?.props?.flash.message);
                } else {
                    toast.success('Famille ajoutée avec succès');
                }
            },
            onError: (errors) => {
                if (errors.intitule) {
                    toast.error(errors.intitule[0]);
                } else {
                    toast.error("Échec de l'ajout");
                }
            },
        });
    };


    const handleDeleteCategory = () => {
        if (selected.length === 0) {
            toast.error('Veuillez sélectionner au moins un famille');
            return;
        }

        MySwal.fire({
            title: 'Êtes-vous sûr?',
            text: "Vous ne pourrez pas revenir en arrière!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Oui, supprimez-le!',
            cancelButtonText: 'Annuler',
            background: '#1e1e1e',
            color: '#FFF',
            iconColor: '#fb2c36',
            confirmButtonColor: '#fb2c36',
            cancelButtonColor: '#555',
            customClass: {
                popup: 'rounded-2xl shadow-xl',
                confirmButton: 'text-black font-semibold px-4 py-2 rounded',
                cancelButton: 'text-white px-4 py-2 rounded',
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete('/famille/delete', {
                    data: { ids: selected },
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        toast.success('Famille supprimé avec succès');
                        setSelected([]);
                    },
                    onError: () =>
                        toast.error('Échec de la suppression'),
                });
            }
        });
    };


    async function handleGetCategory(id) {
        try {
            const response = await axios.get(`/famille/show?id=${id}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            modalEditControl();
            setCategory(response.data.category);
        } catch (error) {
            console.error('Failed to fetch category:', error);
            toast.error('Échec de la récupération de la famille');
        }
    }

    const handleEditCategory = (e) => {
        e.preventDefault();

        router.put(`/famille/${category.id}/edit/`, category, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                modalEditControl();
                toast.success('Famille modifié avec succès');
            },
            onError: () => {
                toast.error('Échec de la modification');
            },
        });
    }

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = categories && categories.map((product) => product.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelect = (id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selected, id];
        } else {
            newSelected = selected.filter((item) => item !== id);
        }

        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;



    const handleStatusChangeEdit = (newStatus) => {
        setCategory((prev) => ({ ...prev, status: newStatus === true ? 1 : 0 }));
    };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Famille" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
                            <div className="bg-[rgba(255,255,255,0.1)] bg-opacity-10 backdrop-blur-3xl rounded-lg w-full max-w-xl p-6 shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Add New Product</h2>
                                    <button onClick={moadlControl} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">
                                        &times;
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="intitule"
                                        value={data.intitule}
                                        onChange={handleInputChange}
                                        placeholder="Intitule"
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />


                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="status">Status : </label>
                                        <ToggleSwitch initialStatus={data.status} onToggle={handleStatusChange} />
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <button
                                            type="button"
                                            onClick={moadlControl}
                                            className="px-4 py-2 text-black bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Annuler
                                        </button>
                                        <button onClick={(e) => handleAddCategory(e)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Ajouter
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isModalEditOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
                            <div className="bg-[rgba(255,255,255,0.1)] bg-opacity-10 backdrop-blur-3xl rounded-lg w-full max-w-xl p-6 shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Add New Product</h2>
                                    <button onClick={modalEditControl} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">
                                        &times;
                                    </button>
                                </div>

                                <form onSubmit={handleEditCategory} className="space-y-4">
                                    <input
                                        type="text"
                                        name="intitule"
                                        value={category.intitule}
                                        onChange={handleInputChangeEdit}
                                        placeholder="Intitule"
                                        className="w-full border px-3 py-2 rounded"
                                        required
                                    />


                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="status">Status : </label>
                                        <ToggleSwitch initialStatus={category.status} onToggle={handleStatusChangeEdit} />
                                    </div>

                                    <div className="flex justify-end space-x-2 pt-4">
                                        <button
                                            type="button"
                                            onClick={modalEditControl}
                                            className="px-4 py-2 text-black bg-gray-200 rounded hover:bg-gray-300"
                                        >
                                            Annuler
                                        </button>
                                        <button type='submit' className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                            Modifier
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    <>
                        <div className="flex gap-4 justify-end p-4">

                            {selected.length > 0 && (
                                <button onClick={handleDeleteCategory} className="bg-red-500 text-black px-4 py-2 rounded-md">Delete</button>
                            )}

                            <button
                                onClick={moadlControl}
                                className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                            >
                                <IoIosAdd /> Ajouter
                            </button>
                        </div>
                        {categories && categories.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className='text-xl'>
                                            <th className="text-left px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selected.length === categories.length && categories.length > 0}
                                                    className="form-checkbox text-blue-600"
                                                />
                                            </th>
                                            <th className="text-left px-4 py-4">_ID</th>
                                            <th className="text-left px-4 py-4">Nom Famille</th>
                                            <th className="text-left px-4 py-4">Statu</th>
                                            <th className="text-left px-4 py-4">Date Creation</th>
                                            <th className="text-left px-4 py-4">Modif</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map((product) => {
                                            const isItemSelected = isSelected(product.id);
                                            return (
                                                <tr key={product.id} className={isItemSelected ? 'bg-gray-600' : ''}>
                                                    <td className="px-4 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={isItemSelected}
                                                            onChange={() => handleSelect(product.id)}
                                                            className="form-checkbox text-blue-600"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 text-center">{product?.id}</td>
                                                    <td className="px-4 py-4">{product?.intitule}</td>
                                                    <td className="px-4 py-4">
                                                        {product?.status === 1 ? (
                                                            <span className="text-green-500">Active</span>
                                                        ) : (
                                                            <span className="text-red-500">Inactive</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {dayjs(product?.created_at).fromNow()}<sub> ({dayjs(product?.created_at).format('YYYY-MM-DD HH:mm:ss')})</sub>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <PencilRuler className='cursor-pointer hover:opacity-20' onClick={(e) => handleGetCategory(product.id)} />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            // Content if there are no categories
                            <div className="flex h-full w-full items-center justify-center">
                                <div className="text-center">
                                    <div className="invert dark:brightness-0 dark:contrast-200">
                                        <img
                                            src={dashboardIcon}
                                            className="mx-auto h-48 w-48 opacity-40"
                                            alt="No categories"
                                        />
                                    </div>
                                    <h1 className="text-2xl font-bold text-sidebar-text dark:text-sidebar-text-dark">
                                        Welcome back <b>{auth.user.name.split(' ')[0]}  </b> to the Dashboard
                                    </h1>
                                    <p className="mt-2 text-sm text-sidebar-text dark:text-sidebar-text-dark">
                                        This is the dashboard page.
                                    </p>
                                </div>
                            </div>
                        )}
                    </>


                </div>
            </div>
        </AppLayout>
    );
}





const ToggleSwitch = ({ initialStatus, onToggle }) => {
    const [checked, setChecked] = useState(initialStatus);

    const handleChange = (event) => {
        const newStatus = event.target.checked;
        setChecked(newStatus);
        if (onToggle) onToggle(newStatus);
    };

    return (
        <div className={'inline-flex items-center cursor-pointer px-2 py-1 rounded-ful text-white'}>

            <span className="mr-2 text-sm">{checked ? 'Enabled' : 'Disabled'}</span>
            <Switch
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'toggle status' }}
                size="small"
            />
        </div >
    );
};