import React, { useState } from 'react';
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
import { ArrowUpToLine, PencilRuler } from 'lucide-react';
import axios from 'axios';

const MySwal = withReactContent(Swal);

const breadcrumbs = [
    {
        title: 'Fournisseur Articles',
        href: '/fournisseur/articles',
    },
];

dayjs.extend(relativeTime);

export default function FisArticles() {
    const { auth, articles, categories, unites } = usePage().props;

    const [selected, setSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalEditOpen, setIsModalEditOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");

    const [article, setArticle] = useState({});


    const { data, setData, post, processing, errors, reset } = useForm({
        id: '',
        designation: '',
        family_id: '',
        sous_family_id: '',
        unite: '',
        status: 1,
        user_id: auth.user.id,
    });

    const moadlControl = () => setIsModalOpen((v) => !v);

    const modalEditControl = () => setIsModalEditOpen((v) => !v);




    const handleAddArticle = (e) => {
        e.preventDefault();

        if (!data.designation || !data.family_id || !data.sous_family_id || !data.unite) {
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


    async function handleGetArticle(id) {
        try {
            const response = await axios.get(`/article/show?id=${id}`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            modalEditControl();
            setArticle(response.data.article);
        } catch (error) {
            console.error('Failed to fetch article:', error);
        }
    }

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




    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Fournisseur Articles" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">

                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.6)]">
                            <div className="bg-[rgba(255,255,255,0.1)] bg-opacity-10 backdrop-blur-3xl rounded-lg w-full max-w-xl p-6 shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">Articles Pour Ajouter</h2>
                                    <button onClick={moadlControl} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">
                                        &times;
                                    </button>
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-white">
                                        {selected.length} articles sélectionnés
                                    </p>
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


                            </div>
                        </div>
                    )}


                    <div className="flex justify-between items-center w-full mb-4 p-4">
                        <div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="border p-2 rounded-md"
                            >
                                <option className='bg-black text-gray dark:bg-white dark:text-black' value="">Toutes les catégories</option>
                                {categories.map(cat => (
                                    <option className='bg-black text-white dark:bg-white dark:text-black' key={cat.id} value={cat.id}>{cat.intitule}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-2">
                            {selected.length > 0 && (
                                <button onClick={handleDeleteArticle} className="bg-red-500 text-black px-4 py-2 rounded-md">Delete</button>
                            )}

                            <button
                                onClick={moadlControl}
                                className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                            >
                                <ArrowUpToLine /> Ajouter
                            </button>
                        </div>
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
                                        <th className="text-left px-4 py-4">Unite</th>
                                        <th className="text-left px-4 py-4">Statu</th>
                                        <th className="text-left px-4 py-4">Date Creation</th>
                                        {/* <th className="text-left px-4 py-4">Modif</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles
                                        .filter((article) =>
                                            selectedCategory === "" ? true : String(article.family_id) === selectedCategory
                                        )
                                        .map((product) => {
                                            const isItemSelected = isSelected(product.id);
                                            return (
                                                <tr key={product.id} className={isItemSelected ? 'bg-gray-900' : ''}>
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
                                                        {categories.find((cat) => cat.id === product?.cat_sous_family_id)?.sub_families.find((subCat) => subCat.id === product?.cat_sous_family_id)?.intitule}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {unites.find((unite) => unite.id === product?.unite_id)?.intitule}
                                                    </td>
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
                                                    {/* <td className="px-4 py-4">
                                                        <PencilRuler className='cursor-pointer hover:opacity-20' onClick={(e) => handleGetArticle(product.id)} />
                                                    </td> */}
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
