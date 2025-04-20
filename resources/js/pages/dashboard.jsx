import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { IoIosAdd } from "react-icons/io";
import { Switch } from '@mui/material';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';



const breadcrumbs = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

dayjs.extend(relativeTime);

export default function Dashboard() {
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
                            {/* <button className="bg-white text-black px-4 py-2 rounded-md">Import Products</button> */}
                            <button onClick={moadlControl} className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer">
                                <IoIosAdd /> Ajouter
                            </button>
                        </div>
                        {articles && articles.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead>
                                        <tr className='text-xl'>
                                            <th className="text-left">
                                                <div className="px-4 py-4">
                                                    <input
                                                        type="checkbox"
                                                        onChange={handleSelectAll}
                                                        checked={selected.length === articles.length && articles.length > 0}
                                                    />
                                                </div>
                                            </th>
                                            <th className="text-left"><div className="px-4 py-4">_ID</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Designation</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Famille</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Sous Famille</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Qty</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Statu</div></th>
                                            <th className="text-left"><div className="px-4 py-4">Date Creation</div></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articles.map((product) => {
                                            const isItemSelected = isSelected(product.id);
                                            return (
                                                <tr key={product.id_article} className={isItemSelected ? 'bg-[rgba(249,250,251,0.2)]' : ''}>
                                                    <td>
                                                        <div className="px-4 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={isItemSelected}
                                                                onChange={() => handleSelect(product.id_article)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td><div className="px-4 py-4 text-center">{product?.id}</div></td>
                                                    <td><div className="px-4 py-4">{product?.designation}</div></td>
                                                    <td><div className="px-4 py-4">{categories.find((cat) => cat.id === product?.cat_family_id)?.intitule}</div></td>
                                                    <td><div className="px-4 py-4">{categories.find((cat) => cat.id === product?.cat_family_id)?.sub_families.find((subCat) => subCat.id === product?.cat_sous_family_id)?.intitule}</div></td>
                                                    <td><div className="px-4 py-4">{product?.qty}</div></td>
                                                    <td><div className="px-4 py-4">
                                                        {product?.status === 1 ? (
                                                            <span className="text-green-500">Active</span>
                                                        ) : (
                                                            <span className="text-red-500">Inactive</span>
                                                        )}
                                                    </div></td>
                                                    <td><div className="px-4 py-4">{dayjs(product?.created_at).fromNow()}</div></td>
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
