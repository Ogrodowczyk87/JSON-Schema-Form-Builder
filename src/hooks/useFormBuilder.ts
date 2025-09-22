// Importowanie hooka useState do zarządzania stanem komponentu
// Importowanie hooka useCallback do optymalizacji funkcji poprzez memoizację
import { useState, useCallback } from 'react';
// Importowanie typów TypeScript dla pól formularza i typu pola
import type { FormField, FieldType } from '../types';

// Globalny licznik do generowania unikalnych identyfikatorów pól
// Zaczyna od 1 i jest inkrementowany przy każdym nowym polu
let fieldIdCounter = 1;

// Funkcja pomocnicza do generowania unikalnych identyfikatorów pól
// Używa licznika i prefiksu 'field_' dla czytelności
const generateFieldId = () => `field_${fieldIdCounter++}`;

// Eksport niestandardowego hooka useFormBuilder
export const useFormBuilder = () => {
    // Stan przechowujący tablicę wszystkich pól formularza
    // Inicjalizowany jako pusta tablica typu FormField[]
    const [fields, setFields] = useState<FormField[]>([]);

    // Stan przechowujący ID aktualnie wybranego pola
    // Może być string (ID pola) lub null (gdy żadne pole nie jest wybrane)
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);

    // Funkcja do dodawania nowego pola do formularza z opcjonalną pozycją wstawienia
    // useCallback zapobiega niepotrzebnemu re-renderowaniu komponentów potomnych
    // fieldType - typ pola do dodania, index - opcjonalna pozycja wstawienia
    const addField = useCallback((fieldType: FieldType, index?: number) => {
        // Tworzenie nowego obiektu pola formularza
        const newField: FormField = {
            // Generowanie unikalnego identyfikatora przy użyciu funkcji generateFieldId
            id: generateFieldId(),
            // Ustawianie typu pola na podstawie przekazanego parametru
            type: fieldType,
            // Tworzenie nazwy pola z prefiksem typu i timestamp dla unikalności
            name: `${fieldType}_${Date.now()}`,
            // Tworzenie etykiety z pierwszą literą typu pola pisaną wielką literą
            // charAt(0).toUpperCase() - pierwsza litera wielka, slice(1) - reszta bez zmian
            label: `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} Field`,
            // Ustawianie pola jako niewymagane domyślnie
            required: false,
            // Ustawianie kolejności na podstawie aktualnej liczby pól
            order: fields.length,
            // Warunkowe dodawanie opcji tylko dla pól select i multiselect
            // Operator ternary sprawdza typ pola i dodaje domyślne opcje lub undefined
            options: (fieldType === 'select' || fieldType === 'multiselect') ? [
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
            ] : undefined,
        };

        // Aktualizacja stanu pól z możliwością wstawienia w określonej pozycji
        setFields(prevFields => {
            // Tworzenie kopii aktualnej tablicy pól (immutability)
            const newFields = [...prevFields];
            // Określenie pozycji wstawienia - jeśli index nie podany, wstaw na końcu
            const insertIndex = index !== undefined ? index : newFields.length;
            // Wstawienie nowego pola w określonej pozycji
            // splice(insertIndex, 0, newField) - wstaw w pozycji insertIndex, usuń 0 elementów, dodaj newField
            newFields.splice(insertIndex, 0, newField);

            // Aktualizacja kolejności dla wszystkich pól po wstawieniu
            // map tworzy nową tablicę z zaktualizowanymi wartościami order
            return newFields.map((field, idx) => ({
                // Kopiowanie wszystkich właściwości pola przy użyciu spread operatora
                ...field,
                // Nadpisanie wartości order na podstawie aktualnego indeksu
                order: idx,
            }));
        });

        // Automatyczne zaznaczenie nowo dodanego pola
        setSelectedFieldId(newField.id);
    }, [fields.length]); // Dependency array - funkcja zostanie odtworzona gdy zmieni się długość tablicy fields

    // Funkcja do usuwania pola z formularza na podstawie jego ID
    // useCallback zapobiega niepotrzebnemu re-renderowaniu komponentów potomnych
    // fieldId - unikalny identyfikator pola do usunięcia
    const removeField = useCallback((fieldId: string) => {
        // Aktualizacja stanu pól - usunięcie pola o określonym ID
        setFields(prevFields => {
            // Filtrowanie tablicy pól - usunięcie pola o podanym ID
            // filter tworzy nową tablicę zawierającą tylko pola o różnych ID
            const newFields = prevFields.filter(field => field.id !== fieldId);

            // Aktualizacja kolejności dla pozostałych pól po usunięciu
            // map tworzy nową tablicę z zaktualizowanymi wartościami order
            return newFields.map((field, idx) => ({
                // Kopiowanie wszystkich właściwości pola przy użyciu spread operatora
                ...field,
                // Nadpisanie wartości order na podstawie nowego indeksu po usunięciu
                order: idx,
            }));
        });

        // Sprawdzenie czy usuwane pole było aktualnie zaznaczone
        // Jeśli tak, to wyczyść zaznaczenie (ustaw na null)
        if (selectedFieldId === fieldId) {
            setSelectedFieldId(null);
        }
    }, [selectedFieldId]); // Dependency array - funkcja zostanie odtworzona gdy zmieni się selectedFieldId

    // Funkcja do aktualizacji istniejącego pola w formularzu
    // useCallback zapobiega niepotrzebnemu re-renderowaniu komponentów potomnych
    // updatedField - obiekt pola z zaktualizowanymi wartościami
    const updateField = useCallback((updatedField: FormField) => {
        // Aktualizacja stanu pól - zastąpienie pola o tym samym ID zaktualizowaną wersją
        setFields(prevFields =>
            // Mapowanie przez wszystkie pola - zamiana pola o odpowiednim ID na zaktualizowane
            prevFields.map(field =>
                // Sprawdzenie czy ID pola pasuje do ID aktualizowanego pola
                field.id === updatedField.id
                    ? updatedField  // Jeśli tak, użyj zaktualizowanego pola
                    : field         // Jeśli nie, zostaw pole bez zmian
            )
        );
    }, []); // Pusta dependency array - funkcja nie zależy od żadnych wartości

    // Funkcja do zmiany kolejności pól w formularzu (drag & drop)
    // useCallback zapobiega niepotrzebnemu re-renderowaniu komponentów potomnych
    // fromIndex - początkowa pozycja pola, toIndex - docelowa pozycja pola
    const reorderFields = useCallback((fromIndex: number, toIndex: number) => {
        // Aktualizacja stanu pól - przemieszczenie pola z jednej pozycji na drugą
        setFields(prevFields => {
            // Tworzenie kopii aktualnej tablicy pól (immutability)
            const newFields = [...prevFields];
            // Usunięcie pola z początkowej pozycji i zapisanie go w zmiennej
            // splice(fromIndex, 1) - usuń 1 element z pozycji fromIndex
            const [movedField] = newFields.splice(fromIndex, 1);
            // Wstawienie usuniętego pola w nowej pozycji
            // splice(toIndex, 0, movedField) - wstaw w pozycji toIndex, usuń 0 elementów, dodaj movedField
            newFields.splice(toIndex, 0, movedField);

            // Aktualizacja kolejności dla wszystkich pól po przemieszeniu
            // map tworzy nową tablicę z zaktualizowanymi wartościami order
            return newFields.map((field, idx) => ({
                // Kopiowanie wszystkich właściwości pola przy użyciu spread operatora
                ...field,
                // Nadpisanie wartości order na podstawie nowego indeksu po przemieszeniu
                order: idx,
            }));
        });
    }, []); // Pusta dependency array - funkcja nie zależy od żadnych wartości

    // Funkcja do zaznaczania konkretnego pola jako aktywne
    // useCallback zapobiega niepotrzebnemu re-renderowaniu komponentów potomnych
    // fieldId - identyfikator pola do zaznaczenia
    const selectField = useCallback((fieldId: string) => {
        // Ustawienie ID wybranego pola w stanie
        setSelectedFieldId(fieldId);
    }, []); // Pusta dependency array - funkcja nie zależy od żadnych wartości

    // Funkcja do pobierania aktualnie zaznaczonego pola
    // useCallback zapobiega niepotrzebnemu re-renderowaniu komponentów potomnych
    // Zwraca obiekt pola lub null jeśli żadne pole nie jest zaznaczone
    const getSelectedField = useCallback(() => {
        // Wyszukiwanie pola o ID równym selectedFieldId w tablicy fields
        // find zwraca pierwsze pasujące pole lub undefined
        // Operator || zwraca null jeśli pole nie zostało znalezione
        return fields.find(field => field.id === selectedFieldId) || null;
    }, [fields, selectedFieldId]); // Dependency array - funkcja zależy od fields i selectedFieldId

    // Funkcja do czyszczenia zaznaczenia pola
    // useCallback zapobiega niepotrzebnemu re-renderowaniu komponentów potomnych
    const clearSelection = useCallback(() => {
        // Ustawienie selectedFieldId na null - brak zaznaczenia
        setSelectedFieldId(null);
    }, []); // Pusta dependency array - funkcja nie zależy od żadnych wartości

    // Zwracanie obiektu z dostępnymi stanami i funkcjami hooka
    return {
        fields,                           // Tablica wszystkich pól formularza
        selectedFieldId,                  // ID aktualnie wybranego pola
        selectedField: getSelectedField(), // Obiekt aktualnie wybranego pola (lub null)
        addField,                         // Funkcja do dodawania nowych pól
        removeField,                      // Funkcja do usuwania pól
        updateField,                      // Funkcja do aktualizacji istniejących pól
        reorderFields,                    // Funkcja do zmiany kolejności pól
        selectField,                      // Funkcja do zaznaczania pola
        clearSelection,                   // Funkcja do czyszczenia zaznaczenia
    };
};