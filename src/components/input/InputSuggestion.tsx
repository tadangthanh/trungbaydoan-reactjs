import { useEffect, useState } from "react";

export default function InputSuggestion({ placeholder, label, required, data, setData, request, idPrefix }: { placeholder: string, label: string, data: any, setData: any, request: any, idPrefix: string, required: boolean }) {
    const [emailInput, setEmailInput] = useState('');
    const [idAdd, setIdAdd] = useState(0);
    const [emailsIgnores, setEmailsIgnores] = useState<string[]>(['']);
    const [idRemove, setIdRemove] = useState(0);
    const [dataSuggestion, setDataSuggestion] = useState([] as any);
    const [suggestionsVisible, setSuggestionsVisible] = useState(false);
    const [debouncedEmail, setDebouncedEmail] = useState(emailInput);
    const blurInput = () => {
        setTimeout(() => {
            const suggestionsContainer = document.getElementById(`${idPrefix}-suggestions`);
            if (suggestionsContainer) {
                suggestionsContainer.innerHTML = '';
            }
        }, 150);
    }
    // Debounce the email input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedEmail(emailInput);
        }, 150); // Adjust the delay as needed

        return () => {
            clearTimeout(handler);
        };
    }, [emailInput]);
    const focusInput = () => {
        const input = document.getElementById(`${idPrefix}-email-input`) as HTMLInputElement;
        if (input) {
            input.readOnly = false;
            input.focus();
        }
    }
    useEffect(() => {
        if (debouncedEmail) {
            setSuggestionsVisible(true);
            request(debouncedEmail, emailsIgnores)
                .then((response: any) => {
                    const data = response.data;
                    setDataSuggestion(data);
                }).catch((error: any) => {
                    console.log(error);
                });
        } else {
            setDataSuggestion([]);
        }
    }, [debouncedEmail, request]);
    const handleSuggestions = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setEmailInput(email);
    }

    const removeId = (id: number) => {
        setData(data.filter((id: number) => id !== idRemove));
    }

    const addId = (id: number) => {
        setData([...data, id]);
    }

    useEffect(() => {
        addId(idAdd);
    }, [idAdd]);

    useEffect(() => {
        removeId(idRemove);
    }, [idRemove]);

    useEffect(() => {
        if (suggestionsVisible) {
            showSuggestions();
        }
    }, [dataSuggestion]);

    const showSuggestions = () => {
        const suggestionsContainer = document.getElementById(`${idPrefix}-suggestions`);
        const suggestionShow = document.getElementById(`${idPrefix}-suggestion-show`);

        if (suggestionsContainer && suggestionShow) {
            suggestionsContainer.innerHTML = '';
            dataSuggestion?.forEach((d: any) => {
                const suggestion = document.createElement('li');
                suggestion.innerText = d.email + '  (' + d.fullName + ')';
                suggestion.title = d.fullName + ' - ' + d.email + ' - Chuyên ngành: ' + d.department + ' - K' + d.academicYear + ' - Khoa: ' + d.major;
                suggestion.onclick = () => {
                    setEmailInput(d.email);
                    setIdAdd(d.id);
                    setEmailsIgnores([...emailsIgnores, d.email]);
                    setEmailInput('');
                    focusInput();
                    const span = document.createElement('span');
                    span.className = 'form-control advisor-email suggestion-email';
                    span.innerText = d.email;
                    span.style.cursor = 'pointer';
                    span.style.display = 'inline';
                    span.title = "xoá thành viên"
                    suggestionShow.appendChild(span);
                    suggestionsContainer.innerHTML = '';
                    const btn = document.createElement('button');
                    btn.innerText = 'x';
                    btn.className = 'btn-remove-tag';
                    span.appendChild(btn);
                    span.onclick = () => {
                        setEmailsIgnores(emailsIgnores.filter((email: string) => email !== d.email));
                        setEmailInput('');
                        setIdRemove(d.id);
                        span.remove();
                    }
                };
                suggestionsContainer.appendChild(suggestion);
            });
        }
    }

    return (
        <div className="suggestion-container">
            <label>
                {label} {required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <div className="suggestion-show" id={`${idPrefix}-suggestion-show`}></div>
            <div className="tag-container">
                <input
                    onBlur={blurInput}
                    onFocus={focusInput}
                    value={emailInput}
                    id={`${idPrefix}-email-input`}
                    onChange={handleSuggestions}
                    type="email"
                    className="form-control advisor-email"
                    placeholder={placeholder}
                />
                <ul className="suggestions" id={`${idPrefix}-suggestions`}></ul>
            </div>
        </div>
    );
}
