import React, { useState } from 'react'
import { setCompanyPageName } from '../actions';

interface SettingsModalProps {
    email?: string | null;
    pageName: string | null;
    onPageNameChange: (newPageName: string) => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ email, pageName, onPageNameChange }) => {
    const [newPageName, setNewPageName] = useState("")
    const [loading, setLoading] = useState<boolean>(false)

    const handleSave = async () => {
        if (newPageName != "") {
            setLoading(true);
            try {
                if (email) {
                    await setCompanyPageName(email, newPageName)
                    onPageNameChange(newPageName)
                    setNewPageName("")
                    setLoading(false);
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    return (
        <dialog id="my_modal_3" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <h3 className="font-bold text-lg">Paramètres</h3>
                <label className='form-control w-full'>
                    <div className='label'>
                        <span className='label-text'>Le nom de votre page (Ce n'est pas modifiable)</span>
                    </div>
                    {pageName ? (
                        <div >
                            <div className='badge badge-accent'>{pageName}</div>
                        </div>
                    ) : (
                        <div className='space-x-2'>
                            <input
                                type="text"
                                placeholder='Nom de votre page'
                                className='input input-bordered input-sm w-fill'
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                className='btn btn-sm w-fit btn-accent'
                                disabled={loading}
                                onClick={handleSave}

                            >
                                {loading ? "Enregistrement..." : "Enregistrer"}
                            </button>

                        </div>
                    )}
                </label>
            </div>
        </dialog>
    )
}

export default SettingsModal
