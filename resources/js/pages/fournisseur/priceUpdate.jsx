import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { IoIosAdd } from "react-icons/io";
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import dashboardIcon from '../../../assets/dashboard/dashboard_icon.png'


import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const breadcrumbs = [
    {
        title: 'Fournisseur Pirce Update',
        href: '/fournisseur/price-update',
    },
];

dayjs.extend(relativeTime);

export default function PriceUpdate() {
    const { auth, fis_articles, categories, unites } = usePage().props;


    const [selected, setSelected] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [filterText, setFilterText] = useState("");
    const [filterCategoryId, setFilterCategoryId] = useState("");

    const [article, setArticle] = useState({});


    const { data, setData, post, processing, errors, reset } = useForm({});

    const moadlControl = () => setIsModalOpen((v) => !v);






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
            const newSelected = fis_articles && fis_articles.map((product) => product.id);
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
            <Head title="Price Update" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">

                    <div className="flex justify-between items-center w-full mb-4 p-4">

                        <input
                            list="categories"
                            value={filterText}
                            onChange={e => {
                                const text = e.target.value;
                                setFilterText(text);
                                const cat = categories.find(c => c.intitule === text);
                                setFilterCategoryId(cat ? String(cat.id) : "");
                            }}
                            placeholder="Toutes les catégories"
                            className="border p-2 rounded-md"
                        />
                        <datalist id="categories">
                            {categories?.map(cat => (
                                <option key={cat.id} value={cat.intitule} />
                            ))}
                        </datalist>


                        <div className="flex gap-2">
                            {selected.length > 0 && (
                                <button onClick={handleDeleteArticle} className="bg-red-500 text-black px-4 py-2 rounded-md">Delete</button>
                            )}

                            <button
                                onClick={moadlControl}
                                className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md flex items-center gap-2 cursor-pointer"
                            >
                                <IoIosAdd /> Ajouter
                            </button>
                        </div>
                    </div>

                    {fis_articles && fis_articles.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead>
                                    <tr className='text-xl'>
                                        <th className="text-left px-4 py-4">
                                            <input
                                                type="checkbox"
                                                onChange={handleSelectAll}
                                                checked={selected.length === fis_articles.length && fis_articles.length > 0}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {fis_articles
                                        .filter(f =>
                                            !filterCategoryId
                                                ? true
                                                : String(f.article.family?.id) === filterCategoryId
                                        )
                                        .map((f) => {
                                            const isItemSelected = isSelected(f.id);
                                            return (
                                                <tr key={f.id} className={isItemSelected ? 'bg-gray-900' : ''}>
                                                    <td className="px-4 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={isItemSelected}
                                                            onChange={() => handleSelect(f.id)}
                                                            className="form-checkbox text-blue-600"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 text-center">{f?.id}</td>
                                                    {/* article fields */}
                                                    <td className="px-4 py-4">{f.article?.designation}</td>
                                                    <td className="px-4 py-4">{f.article.family?.intitule ?? '—'}</td>
                                                    <td className="px-4 py-4">{f.article.sub_family?.intitule}</td>
                                                    <td className="px-4 py-4">{f.article.unite?.intitule}</td>

                                                    <td className="px-4 py-4">
                                                        {f?.status === 1 ? (
                                                            <span className="text-green-500">Active</span>
                                                        ) : (
                                                            <span className="text-red-500">Inactive</span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {dayjs(f.created_at).fromNow()}
                                                        <sub>({dayjs(f.created_at).format('YYYY-MM-DD HH:mm:ss')})</sub>
                                                    </td>

                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        // Content if there are no fis_articles
                        <div className="flex h-full w-full items-center justify-center">
                            <div className="text-center">
                                <div className="invert dark:brightness-0 dark:contrast-200">
                                    <img
                                        src={dashboardIcon}
                                        className="mx-auto h-48 w-48 opacity-40"
                                        alt="No fis_articles"
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
