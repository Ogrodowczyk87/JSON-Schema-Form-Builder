// Importowanie głównej biblioteki React
import React from 'react';
// Importowanie hooków useDrop i useDrag z react-dnd do obsługi przeciągania i upuszczania
import { useDrop, useDrag } from 'react-dnd';
// Importowanie komponentów Material-UI do budowy interfejsu użytkownika
import {
    Box,          // Uniwersalny kontener layoutu
    Paper,        // Komponent powierzchni z cieniem
    Typography,   // Komponenty tekstowe z różnymi stylami
    IconButton,   // Przycisk z ikoną
    Card,         // Komponent karty
    CardContent,  // Zawartość karty
    Chip,         // Mały znacznik do wyświetlania informacji
} from '@mui/material';
// Importowanie ikon Material-UI dla różnych funkcjonalności
import {
    DragIndicator,// Ikona wskaźnika przeciągania
    Delete,       // Ikona usuwania
    Edit,         // Ikona edycji
    TextFields,   // Ikona dla pól tekstowych
    Email,        // Ikona dla pól email
    Lock,         // Ikona dla pól hasła
    Numbers,      // Ikona dla pól numerycznych
    CheckBox,     // Ikona dla checkboxów
    ArrowDropDown,// Ikona dla list rozwijanych
    DateRange,    // Ikona dla pól daty
    AccessTime,   // Ikona dla pól czasu
    Link,         // Ikona dla pól URL
    Phone,        // Ikona dla numerów telefonu
    Palette,      // Ikona dla kolorów
    Tune,         // Ikona dla sliderów/zakresów
    AttachFile,   // Ikona dla uploadu plików
    Subject,      // Ikona dla obszarów tekstowych
} from '@mui/icons-material';
// Importowanie typów TypeScript z lokalnego modułu types
import type { FormField, FieldType } from '../../types';
// Importowanie stałych definiujących typy przeciągania
import { DRAG_TYPES } from '../../types';

// Interfejs TypeScript definiujący props dla głównego komponentu FormBuilderCanvas
interface FormBuilderCanvasProps {
    fields: FormField[];                                              // Tablica pól formularza
    onAddField: (fieldType: FieldType, index?: number) => void;     // Funkcja dodawania pola
    onRemoveField: (fieldId: string) => void;                       // Funkcja usuwania pola
    onSelectField: (fieldId: string) => void;                       // Funkcja zaznaczania pola
    onReorderFields: (fromIndex: number, toIndex: number) => void;  // Funkcja zmiany kolejności
    selectedFieldId: string | null;                                 // ID aktualnie zaznaczonego pola
}

// Interfejs TypeScript dla komponentu obszaru upuszczania
interface DroppableAreaProps {
    onDrop: (fieldType: FieldType, index?: number) => void;  // Funkcja obsługująca upuszczenie
    index?: number;                                           // Opcjonalny indeks pozycji
    isOver: boolean;                                          // Czy element jest przeciągany nad obszarem
}

// Komponent funkcyjny reprezentujący obszar, w którym można upuścić pole
const DroppableArea: React.FC<DroppableAreaProps> = ({ onDrop, index, isOver }) => {
    // Hook useDrop z react-dnd do obsługi upuszczania elementów
    const [{ canDrop }, drop] = useDrop({
        // Akceptowanie tylko elementów typu FIELD_FROM_PALETTE
        accept: DRAG_TYPES.FIELD_FROM_PALETTE,
        // Funkcja wywoływana po upuszczeniu elementu
        drop: (item: { fieldType: FieldType }) => {
            // Wywołanie funkcji onDrop z typem pola i opcjonalnym indeksem
            onDrop(item.fieldType, index);
        },
        // Funkcja collect zbiera informacje o stanie upuszczania
        collect: (monitor) => ({
            isOver: monitor.isOver(),      // Czy element jest nad obszarem
            canDrop: monitor.canDrop(),    // Czy można upuścić element
        }),
    });

    // Tworzenie referencji do elementu DOM dla react-dnd
    const dropRef = React.useRef<HTMLDivElement>(null);
    // Przypisanie referencji do funkcji drop z useDrop
    drop(dropRef);

    // Renderowanie JSX komponentu
    return (
        <div
            ref={dropRef}  // Przypisanie referencji
            style={{
                minHeight: 40,                                                    // Minimalna wysokość obszaru
                border: '2px dashed',                                           // Przerywane obramowanie
                borderColor: isOver ? '#1976d2' : canDrop ? '#9e9e9e' : 'transparent', // Kolor zależny od stanu
                borderRadius: 4,                                                // Zaokrąglone rogi
                display: 'flex',                                                // Flexbox layout
                alignItems: 'center',                                           // Wyśrodkowanie w pionie
                justifyContent: 'center',                                       // Wyśrodkowanie w poziomie
                backgroundColor: isOver ? '#e3f2fd' : canDrop ? '#f5f5f5' : 'transparent', // Kolor tła
                opacity: isOver ? 0.8 : 1,                                     // Przezroczystość
                transition: 'all 0.2s ease-in-out',                           // Płynna animacja
                margin: '4px 0',                                               // Margines góra/dół
            }}
        >
            {/* Wyświetlenie tekstu tylko gdy można upuścić lub element jest nad obszarem */}
            {(isOver || canDrop) && (
                <Typography variant="caption" color="text.secondary">
                    Drop field here
                </Typography>
            )}
        </div>
    );
};

// Interfejs TypeScript dla komponentu pojedynczego pola
interface FieldItemProps {
    field: FormField;                                            // Obiekt pola formularza
    index: number;                                               // Indeks pola w tablicy
    isSelected: boolean;                                         // Czy pole jest zaznaczone
    onSelect: () => void;                                        // Funkcja zaznaczania pola
    onRemove: () => void;                                        // Funkcja usuwania pola
    onMove: (fromIndex: number, toIndex: number) => void;       // Funkcja przesuwania pola
}

// Funkcja pomocnicza zwracająca ikonę odpowiadającą typowi pola
const getFieldIcon = (fieldType: FieldType) => {
    // Switch statement mapujący typ pola na odpowiednią ikonę
    switch (fieldType) {
        case 'text': return <TextFields />;           // Pole tekstowe
        case 'textarea': return <Subject />;          // Obszar tekstowy
        case 'email': return <Email />;               // Pole email
        case 'password': return <Lock />;             // Pole hasła
        case 'number':                                 // Pole numeryczne
        case 'integer': return <Numbers />;           // Pole liczby całkowitej
        case 'boolean': return <CheckBox />;          // Checkbox
        case 'select':                                 // Lista rozwijana
        case 'multiselect': return <ArrowDropDown />; // Lista wielokrotnego wyboru
        case 'date':                                   // Pole daty
        case 'datetime': return <DateRange />;        // Pole daty i czasu
        case 'time': return <AccessTime />;           // Pole czasu
        case 'url': return <Link />;                  // Pole URL
        case 'tel': return <Phone />;                 // Pole telefonu
        case 'color': return <Palette />;             // Pole koloru
        case 'range': return <Tune />;                // Slider zakresu
        case 'file': return <AttachFile />;           // Upload pliku
        default: return <TextFields />;               // Domyślna ikona
    }
};

// Komponent funkcyjny reprezentujący pojedyncze pole w formularzu
const FieldItem: React.FC<FieldItemProps> = ({
    field,      // Destrukturyzacja props - obiekt pola
    index,      // Destrukturyzacja props - indeks
    isSelected, // Destrukturyzacja props - stan zaznaczenia
    onSelect,   // Destrukturyzacja props - funkcja zaznaczania
    onRemove,   // Destrukturyzacja props - funkcja usuwania
    onMove,     // Destrukturyzacja props - funkcja przesuwania
}) => {
    // Hook useDrag z react-dnd do obsługi przeciągania pola
    const [{ isDragging }, drag] = useDrag({
        // Typ przeciąganego elementu - pole w formularzu
        type: DRAG_TYPES.FIELD_IN_FORM,
        // Dane przekazywane podczas przeciągania
        item: { id: field.id, index },
        // Funkcja collect zbiera informacje o stanie przeciągania
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // Hook useDrop z react-dnd do obsługi upuszczania na inne pole
    const [, drop] = useDrop({
        // Akceptowanie elementów typu FIELD_IN_FORM
        accept: DRAG_TYPES.FIELD_IN_FORM,
        // Funkcja hover wywoływana gdy element jest przeciągany nad tym polem
        hover: (item: { id: string; index: number }) => {
            // Sprawdzenie czy indeksy są różne (unikanie niepotrzebnych operacji)
            if (item.index !== index) {
                // Wywołanie funkcji przesuwania z poprzedniego na obecny indeks
                onMove(item.index, index);
                // Aktualizacja indeksu w przeciąganym elemencie
                item.index = index;
            }
        },
    });

    // Tworzenie referencji do elementu DOM dla kombinacji drag i drop
    const dragDropRef = React.useRef<HTMLDivElement>(null);
    // Kombinowanie funkcji drag i drop na jednej referencji
    drag(drop(dragDropRef));

    // Renderowanie JSX komponentu
    return (
        <div ref={dragDropRef}>  {/* Przypisanie referencji drag&drop */}
            <Card
                sx={{
                    mb: 1,                                              // Margines dolny
                    opacity: isDragging ? 0.5 : 1,                    // Przezroczystość podczas przeciągania
                    cursor: 'grab',                                     // Kursor wskazujący możliwość chwycenia
                    border: isSelected ? 2 : 1,                       // Grubość obramowania zależna od zaznaczenia
                    borderColor: isSelected ? 'primary.main' : 'grey.300', // Kolor obramowania
                    '&:hover': {
                        boxShadow: 2,                                   // Cień przy najechaniu
                    },
                }}
                onClick={onSelect}  // Zaznaczenie pola przy kliknięciu
            >
                <CardContent sx={{ p: 2 }}>  {/* Zawartość karty z paddingiem */}
                    {/* Główny kontener flex z wyrównaniem */}
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        {/* Lewa strona - informacje o polu */}
                        <Box display="flex" alignItems="center" gap={1}>
                            {/* Ikona wskaźnika przeciągania */}
                            <DragIndicator color="action" sx={{ cursor: 'grab' }} />
                            {/* Ikona typu pola */}
                            {getFieldIcon(field.type)}
                            <Box>
                                {/* Nazwa/etykieta pola */}
                                <Typography variant="subtitle2">
                                    {field.label || field.name}
                                </Typography>
                                {/* Kontener dla chipów */}
                                <Box display="flex" gap={0.5} mt={0.5}>
                                    {/* Chip z typem pola */}
                                    <Chip
                                        label={field.type}
                                        size="small"
                                        variant="outlined"
                                        sx={{ fontSize: '0.75rem' }}
                                    />
                                    {/* Warunkowe wyświetlenie chipa "Required" */}
                                    {field.required && (
                                        <Chip
                                            label="Required"
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            sx={{ fontSize: '0.75rem' }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Box>
                        {/* Prawa strona - przyciski akcji */}
                        <Box>
                            {/* Przycisk edycji */}
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();  // Zatrzymanie propagacji eventu
                                    onSelect();           // Zaznaczenie pola
                                }}
                            >
                                <Edit />
                            </IconButton>
                            {/* Przycisk usuwania */}
                            <IconButton
                                size="small"
                                color="error"
                                onClick={(e) => {
                                    e.stopPropagation();  // Zatrzymanie propagacji eventu
                                    onRemove();           // Usunięcie pola
                                }}
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </Box>
                    {/* Warunkowe wyświetlenie opisu pola */}
                    {field.description && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {field.description}
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// Główny komponent FormBuilderCanvas - obszar budowania formularza
const FormBuilderCanvas: React.FC<FormBuilderCanvasProps> = ({
    fields,          // Destrukturyzacja props - tablica pól
    onAddField,      // Destrukturyzacja props - funkcja dodawania
    onRemoveField,   // Destrukturyzacja props - funkcja usuwania
    onSelectField,   // Destrukturyzacja props - funkcja zaznaczania
    onReorderFields, // Destrukturyzacja props - funkcja zmiany kolejności
    selectedFieldId, // Destrukturyzacja props - ID zaznaczonego pola
}) => {
    // Hook useDrop z react-dnd do obsługi upuszczania pól na obszar główny
    const [{ isOver }, drop] = useDrop({
        // Akceptowanie elementów z palety pól
        accept: DRAG_TYPES.FIELD_FROM_PALETTE,
        // Funkcja drop wywoływana po upuszczeniu elementu
        drop: (item: { fieldType: FieldType }) => {
            // Dodanie pola na końcu formularza
            onAddField(item.fieldType);
        },
        // Funkcja collect zbiera informacje o stanie
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    // Tworzenie referencji do elementu DOM dla drop
    const dropRef = React.useRef<HTMLDivElement>(null);
    // Przypisanie referencji do funkcji drop
    drop(dropRef);

    // Warunek renderowania pustego formularza
    if (fields.length === 0) {
        return (
            <div ref={dropRef}>  {/* Referencja drop dla pustego obszaru */}
                <Paper
                    sx={{
                        p: 4,                                                    // Padding 4 jednostki
                        textAlign: 'center',                                    // Wyśrodkowany tekst
                        minHeight: 400,                                          // Minimalna wysokość
                        display: 'flex',                                         // Flexbox layout
                        flexDirection: 'column',                                 // Kolumna
                        justifyContent: 'center',                                // Wyśrodkowanie w pionie
                        alignItems: 'center',                                    // Wyśrodkowanie w poziomie
                        border: '2px dashed',                                   // Przerywane obramowanie
                        borderColor: isOver ? 'primary.main' : 'grey.400',     // Kolor zależny od stanu
                        backgroundColor: isOver ? 'primary.light' : 'grey.50',  // Tło zależne od stanu
                        opacity: isOver ? 0.8 : 1,                             // Przezroczystość
                        transition: 'all 0.2s ease-in-out',                    // Płynna animacja
                    }}
                >
                    {/* Główny nagłówek pustego formularza */}
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Your form is empty
                    </Typography>
                    {/* Instrukcja dla użytkownika */}
                    <Typography variant="body2" color="text.secondary">
                        Drag fields from the palette to start building your form
                    </Typography>
                </Paper>
            </div>
        );
    }

    // Renderowanie formularza z polami
    return (
        <div ref={dropRef}>  {/* Referencja drop dla obszaru z polami */}
            <Box sx={{ p: 2 }}>  {/* Kontener z paddingiem */}
                {/* Nagłówek buildera formularza */}
                <Typography variant="h6" gutterBottom>
                    Form Builder
                </Typography>

                {/* Obszar upuszczania na początku formularza */}
                <DroppableArea
                    onDrop={(fieldType) => onAddField(fieldType, 0)}  // Dodanie na pozycji 0
                    index={0}                                          // Indeks 0
                    isOver={isOver}                                    // Stan hover
                />

                {/* Mapowanie przez wszystkie pola formularza */}
                {fields.map((field, index) => (
                    // React.Fragment pozwala na zwrócenie wielu elementów bez dodatkowego wrappera
                    <React.Fragment key={field.id}>
                        {/* Komponent pojedynczego pola */}
                        <FieldItem
                            field={field}                                    // Obiekt pola
                            index={index}                                    // Indeks w tablicy
                            isSelected={selectedFieldId === field.id}       // Sprawdzenie zaznaczenia
                            onSelect={() => onSelectField(field.id)}        // Funkcja zaznaczania
                            onRemove={() => onRemoveField(field.id)}        // Funkcja usuwania
                            onMove={onReorderFields}                         // Funkcja przesuwania
                        />
                        {/* Obszar upuszczania po każdym polu */}
                        <DroppableArea
                            onDrop={(fieldType) => onAddField(fieldType, index + 1)}  // Dodanie na pozycji index+1
                            index={index + 1}                                          // Indeks o 1 większy
                            isOver={isOver}                                            // Stan hover
                        />
                    </React.Fragment>
                ))}
            </Box>
        </div>
    );
};

// Eksport komponentu jako domyślny eksport modułu
export default FormBuilderCanvas;