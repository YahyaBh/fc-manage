import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { IoIosAdd } from "react-icons/io";
import { Switch } from '@mui/material';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import dashboardIcon from '../../assets/dashboard/dashboard_icon.png'


import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const breadcrumbs = [
    {
        title: 'Articles',
        href: '/articles',
    },
];

dayjs.extend(relativeTime);

export default function Articles() {
    const { auth, articles, categories } = usePage().props;

    const [selected, setSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
        designation: '',
        family_id: '',
        sous_family_id: '',
        qty: '',
        status: 1,
        user_id: auth.user.id,
    });

    const moadlControl = () => setIsModalOpen((v) => !v);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const family_id = e.target.value;
        setData((prev) => ({
            ...prev,
            family_id,
            sous_family_id: '', // reset when family changes
        }));
    };

    const handleSubcategoryChange = (e) => {
        const sous_family_id = e.target.value;
        setData((prev) => ({ ...prev, sous_family_id }));
    };

    const handleAddArticle = (e) => {
        e.preventDefault();

        if (!data.designation || !data.family_id || !data.sous_family_id || !data.qty) {
            toast.error('Veuillez remplir tous les champs');
            return;
        } else {
            post('/article/add', {
                data: data,
                onSuccess: () => {
                    moadlControl();
                    reset();
                    toast.success('Article ajouté avec succès');
                },
                onError: () => {
                    toast.error('Échec de l\'ajout');
                },
            });
        }
    };

    const handleDeleteArticle = () => {
        if (selected.length === 0) {
            toast.error('Veuillez sélectionner au moins un article');
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
                router.delete('/article/delete', {
                    data: { ids: selected },
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        toast.success('Article supprimé avec succès');
                        setSelected([]);
                    },
                    onError: () =>
                        toast.error('Échec de la suppression'),
                });
            }
        });
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const newSelected = articles && articles.map((product) => product.id);
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

    const handleStatusChange = (newStatus) => {
        setData((prev) => ({ ...prev, status: newStatus === true ? 1 : 0 }));
    };


    return (
        auth.user.role === 'client' ?

            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Dashboard" />
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

                                    <form onSubmit={handleAddArticle} className="space-y-4">
                                        <input
                                            type="text"
                                            name="designation"
                                            value={data.name}
                                            onChange={handleInputChange}
                                            placeholder="Designation"
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />
                                        <input
                                            type="number"
                                            name="qty"
                                            value={data.qty}
                                            onChange={handleInputChange}
                                            placeholder="Quantity"
                                            className="w-full border px-3 py-2 rounded"
                                            required
                                        />

                                        {/* Category */}
                                        <div>
                                            <label className="block mb-1 text-sm font-medium text-white">Category</label>
                                            <select
                                                name="family_id"
                                                value={data.family_id}
                                                onChange={handleCategoryChange}
                                                className="w-full border px-3 py-2 rounded text-gray"
                                                required
                                            >
                                                <option disabled value="">
                                                    Select Category
                                                </option>
                                                {categories.map((cat) => (
                                                    <option key={cat.id} value={cat.id} className='text-black'>
                                                        {cat.intitule}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Subcategory */}
                                        {data.family_id && categories.find(cat => cat.id === Number(data.family_id))?.sub_families.length > 0 && (
                                            <div>
                                                <label className="block mb-1 text-sm font-medium text-white">Subcategory</label>
                                                <select
                                                    name="sous_family_id"
                                                    value={data.sous_family_id}
                                                    onChange={handleSubcategoryChange}
                                                    className="w-full border px-3 py-2 rounded"
                                                    required
                                                >
                                                    <option disabled value="" className='text-gray'>
                                                        Select Subcategory
                                                    </option>
                                                    {categories
                                                        .find((cat) => cat.id === Number(data.family_id))
                                                        ?.sub_families.map((sub) => (
                                                            <option key={sub.id} value={sub.id} className='text-black'>
                                                                {sub.intitule}
                                                            </option>
                                                        ))}
                                                </select>
                                            </div>
                                        )}

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
                                            <button onClick={(e) => handleAddArticle(e)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                                Ajouter
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}



                        <>
                            <div className="flex gap-4 justify-end p-4">
                                {/* <button className="bg-white text-black px-4 py-2 rounded-md">Bulk Edit</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Categories</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Warehouses</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Add Products</button> */}
                                {selected.length > 0 && (
                                    <button onClick={handleDeleteArticle} className="bg-red-500 text-black px-4 py-2 rounded-md">Delete</button>
                                )}
                                {/* add dark mode to this button */}


                                <button
                                    onClick={moadlControl}
                                    className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                                >
                                    <IoIosAdd /> Ajouter
                                </button>
                            </div>
                            {articles && articles.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead>
                                            <tr className='text-xl'>
                                                <th className="text-left px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selected.length === articles.length && articles.length > 0}
                                                        className="form-checkbox text-blue-600"
                                                    />
                                                </th>
                                                <th className="text-left px-4 py-4">_ID</th>
                                                <th className="text-left px-4 py-4">Designation</th>
                                                <th className="text-left px-4 py-4">Famille</th>
                                                <th className="text-left px-4 py-4">Sous Famille</th>
                                                <th className="text-left px-4 py-4">Qty</th>
                                                <th className="text-left px-4 py-4">Statu</th>
                                                <th className="text-left px-4 py-4">Date Creation</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {articles.map((product) => {
                                                const isItemSelected = isSelected(product.id);
                                                return (
                                                    <tr key={product.id} className={isItemSelected ? 'bg-gray-100' : ''}>
                                                        <td className="px-4 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={isItemSelected}
                                                                onChange={() => handleSelect(product.id)}
                                                                className="form-checkbox text-blue-600"
                                                            />
                                                        </td>
                                                        <td className="px-4 py-4 text-center">{product?.id}</td>
                                                        <td className="px-4 py-4">{product?.designation}</td>
                                                        <td className="px-4 py-4">
                                                            {categories.find((cat) => cat.id === product?.cat_family_id)?.intitule}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            {categories.find((cat) => cat.id === product?.cat_family_id)?.sub_families.find((subCat) => subCat.id === product?.cat_sous_family_id)?.intitule}
                                                        </td>
                                                        <td className="px-4 py-4">{product?.qty}</td>
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
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Content if there are no articles
                                <div className="flex h-full w-full items-center justify-center">
                                    <div className="text-center">
                                        <div className="invert dark:brightness-0 dark:contrast-200">
                                            <img
                                                src={dashboardIcon}
                                                className="mx-auto h-48 w-48 opacity-40"
                                                alt="No articles"
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

            : auth.user.role === 'provider' ? (
                <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="Dashboard" />
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

                                        <form onSubmit={handleAddArticle} className="space-y-4">
                                            <input
                                                type="text"
                                                name="designation"
                                                value={data.name}
                                                onChange={handleInputChange}
                                                placeholder="Designation"
                                                className="w-full border px-3 py-2 rounded"
                                                required
                                            />
                                            <input
                                                type="number"
                                                name="qty"
                                                value={data.qty}
                                                onChange={handleInputChange}
                                                placeholder="Quantity"
                                                className="w-full border px-3 py-2 rounded"
                                                required
                                            />

                                            {/* Category */}
                                            <div>
                                                <label className="block mb-1 text-sm font-medium text-white">Category</label>
                                                <select
                                                    name="family_id"
                                                    value={data.family_id}
                                                    onChange={handleCategoryChange}
                                                    className="w-full border px-3 py-2 rounded text-gray"
                                                    required
                                                >
                                                    <option disabled value="">
                                                        Select Category
                                                    </option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id} className='text-black'>
                                                            {cat.intitule}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Subcategory */}
                                            {data.family_id && categories.find(cat => cat.id === Number(data.family_id))?.sub_families.length > 0 && (
                                                <div>
                                                    <label className="block mb-1 text-sm font-medium text-white">Subcategory</label>
                                                    <select
                                                        name="sous_family_id"
                                                        value={data.sous_family_id}
                                                        onChange={handleSubcategoryChange}
                                                        className="w-full border px-3 py-2 rounded"
                                                        required
                                                    >
                                                        <option disabled value="" className='text-gray'>
                                                            Select Subcategory
                                                        </option>
                                                        {categories
                                                            .find((cat) => cat.id === Number(data.family_id))
                                                            ?.sub_families.map((sub) => (
                                                                <option key={sub.id} value={sub.id} className='text-black'>
                                                                    {sub.intitule}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            )}

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
                                                <button onClick={(e) => handleAddArticle(e)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                                    Ajouter
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}



                            <>
                                <div className="flex gap-4 justify-end p-4">
                                    {/* <button className="bg-white text-black px-4 py-2 rounded-md">Bulk Edit</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Categories</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Warehouses</button>
                                <button className="bg-white text-black px-4 py-2 rounded-md">Add Products</button> */}
                                    {selected.length > 0 && (
                                        <button onClick={handleDeleteArticle} className="bg-red-500 text-black px-4 py-2 rounded-md">Delete</button>
                                    )}
                                    {/* add dark mode to this button */}


                                    <button
                                        onClick={moadlControl}
                                        className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                                    >
                                        <IoIosAdd /> Ajouter
                                    </button>
                                </div>
                                {articles && articles.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto">
                                            <thead>
                                                <tr className='text-xl'>
                                                    <th className="text-left px-4 py-4">
                                                        <input
                                                            type="checkbox"
                                                            onChange={handleSelectAll}
                                                            checked={selected.length === articles.length && articles.length > 0}
                                                            className="form-checkbox text-blue-600"
                                                        />
                                                    </th>
                                                    <th className="text-left px-4 py-4">_ID</th>
                                                    <th className="text-left px-4 py-4">Designation</th>
                                                    <th className="text-left px-4 py-4">Famille</th>
                                                    <th className="text-left px-4 py-4">Sous Famille</th>
                                                    <th className="text-left px-4 py-4">Qty</th>
                                                    <th className="text-left px-4 py-4">Statu</th>
                                                    <th className="text-left px-4 py-4">Date Creation</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {articles.map((product) => {
                                                    const isItemSelected = isSelected(product.id);
                                                    return (
                                                        <tr key={product.id} className={isItemSelected ? 'bg-gray-100' : ''}>
                                                            <td className="px-4 py-4">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isItemSelected}
                                                                    onChange={() => handleSelect(product.id)}
                                                                    className="form-checkbox text-blue-600"
                                                                />
                                                            </td>
                                                            <td className="px-4 py-4 text-center">{product?.id}</td>
                                                            <td className="px-4 py-4">{product?.designation}</td>
                                                            <td className="px-4 py-4">
                                                                {categories.find((cat) => cat.id === product?.cat_family_id)?.intitule}
                                                            </td>
                                                            <td className="px-4 py-4">
                                                                {categories.find((cat) => cat.id === product?.cat_family_id)?.sub_families.find((subCat) => subCat.id === product?.cat_sous_family_id)?.intitule}
                                                            </td>
                                                            <td className="px-4 py-4">{product?.qty}</td>
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
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    // Content if there are no articles
                                    <div className="flex h-full w-full items-center justify-center">
                                        <div className="text-center">
                                            <div className="invert dark:brightness-0 dark:contrast-200">
                                                <img
                                                    src={dashboardIcon}
                                                    className="mx-auto h-48 w-48 opacity-40"
                                                    alt="No articles"
                                                />
                                            </div>
                                            <h1 className="text-2xl font-bold text-sidebar-text dark:text-sidebar-text-dark">
                                                Welcome to the Dashboard
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
            ) : ''
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
