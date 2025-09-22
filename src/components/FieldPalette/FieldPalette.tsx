// Importowanie głównej biblioteki React
import React from 'react';
// Importowanie hooka useDrag z react-dnd do obsługi przeciągania elementów
import { useDrag } from 'react-dnd';
// Importowanie komponentów Material-UI do budowy interfejsu użytkownika
import {
    Card,         // Komponent karty do wyświetlania elementów palety
    CardContent,  // Zawartość karty
    Typography,   // Komponenty tekstowe z różnymi stylami
    Box,          // Uniwersalny kontener layoutu
    Chip,         // Mały znacznik do wyświetlania typu pola
} from '@mui/material';
// Importowanie ikon Material-UI dla różnych typów pól formularza
import {
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
import type { FieldType } from '../../types';
// Importowanie stałych definiujących typy przeciągania
import { DRAG_TYPES } from '../../types';

// Interfejs TypeScript definiujący props dla komponentu FieldPaletteItem
interface FieldPaletteItemProps {
    fieldType: FieldType;        // Typ pola (text, email, number, etc.)
    label: string;               // Etykieta wyświetlana użytkownikowi
    description: string;         // Opis funkcjonalności pola
    icon: React.ReactNode;       // Ikona reprezentująca typ pola
}

// Komponent funkcyjny reprezentujący pojedynczy element w palecie pól
// React.FC to skrót od React.FunctionComponent z generycznym typem props
const FieldPaletteItem: React.FC<FieldPaletteItemProps> = ({
    fieldType,     // Destrukturyzacja props - typ pola
    label,         // Destrukturyzacja props - etykieta
    description,   // Destrukturyzacja props - opis
    icon,          // Destrukturyzacja props - ikona
}) => {
    // Hook useDrag z react-dnd do obsługi przeciągania elementu
    // Zwraca tablicę z obiektem stanu i funkcją referencyjną
    const [{ isDragging }, drag] = useDrag({
        // Typ przeciąganego elementu - używany do identyfikacji w dropZone
        type: DRAG_TYPES.FIELD_FROM_PALETTE,
        // Dane przekazywane podczas przeciągania
        item: { fieldType },
        // Funkcja collect zbiera informacje o stanie przeciągania
        collect: (monitor) => ({
            // isDragging - boolean określający czy element jest obecnie przeciągany
            isDragging: monitor.isDragging(),
        }),
    });

    // Tworzenie referencji do elementu DOM dla react-dnd
    // useRef zwraca obiekt z właściwością current wskazującą na element div
    const dragRef = React.useRef<HTMLDivElement>(null);
    // Przypisanie referencji do funkcji drag z useDrag
    drag(dragRef);

    // Renderowanie JSX komponentu
    return (
        // Główny kontener z przypisaną referencją dla drag & drop
        <div ref={dragRef}>
            <Card
                // Właściwość sx Material-UI do stylowania komponentu
                sx={{
                    cursor: 'grab',                    // Kursor wskazujący możliwość chwycenia
                    opacity: isDragging ? 0.5 : 1,    // Przezroczystość podczas przeciągania
                    mb: 1,                             // Margines dolny (margin-bottom)
                    // Efekt hover - podniesienie i cień przy najechaniu myszą
                    '&:hover': {
                        boxShadow: 3,                  // Zwiększenie cienia
                        transform: 'translateY(-2px)', // Przesunięcie w górę o 2px
                    },
                    // Płynna animacja wszystkich zmian przez 0.2 sekundy
                    transition: 'all 0.2s ease-in-out',
                }}
            >
                {/* Zawartość karty z paddingiem 2 jednostki */}
                <CardContent sx={{ p: 2 }}>
                    {/* Kontener flex dla ikony i etykiety */}
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {/* Renderowanie ikony przekazanej jako prop */}
                        {icon}
                        {/* Etykieta pola z pogrubionym fontem */}
                        <Typography variant="subtitle2" fontWeight="bold">
                            {label}
                        </Typography>
                    </Box>
                    {/* Opis pola z mniejszą czcionką i szarym kolorem */}
                    <Typography variant="caption" color="text.secondary">
                        {description}
                    </Typography>
                    {/* Kontener dla chipa z marginesem górnym */}
                    <Box mt={1}>
                        {/* Chip wyświetlający typ pola */}
                        <Chip
                            label={fieldType}              // Tekst wyświetlany w chipie
                            size="small"                   // Mały rozmiar chipa
                            variant="outlined"             // Wariant z obramowaniem
                            sx={{ fontSize: '0.75rem' }}  // Mniejszy rozmiar fontu
                        />
                    </Box>
                </CardContent>
            </Card>
        </div>
    );
};

// Definicja wszystkich dostępnych typów pól w palecie
// Array z obiektami zawierającymi konfigurację każdego typu pola
const FIELD_DEFINITIONS: Array<{
    fieldType: FieldType;        // Typ pola zgodny z TypeScript enum
    label: string;               // Nazwa wyświetlana użytkownikowi
    description: string;         // Opis funkcjonalności
    icon: React.ReactNode;       // Komponent ikony
}> = [
        {
            fieldType: 'text',
            label: 'Text Input',
            description: 'Single line text input field',
            icon: <TextFields color="primary" />,  // Ikona z kolorem primary
        },
        {
            fieldType: 'textarea',
            label: 'Text Area',
            description: 'Multi-line text input field',
            icon: <Subject color="primary" />,
        },
        {
            fieldType: 'email',
            label: 'Email',
            description: 'Email address input with validation',
            icon: <Email color="primary" />,
        },
        {
            fieldType: 'password',
            label: 'Password',
            description: 'Password input field',
            icon: <Lock color="primary" />,
        },
        {
            fieldType: 'number',
            label: 'Number',
            description: 'Numeric input field',
            icon: <Numbers color="primary" />,
        },
        {
            fieldType: 'integer',
            label: 'Integer',
            description: 'Integer number input',
            icon: <Numbers color="primary" />,
        },
        {
            fieldType: 'boolean',
            label: 'Checkbox',
            description: 'Boolean checkbox input',
            icon: <CheckBox color="primary" />,
        },
        {
            fieldType: 'select',
            label: 'Select',
            description: 'Single select dropdown',
            icon: <ArrowDropDown color="primary" />,
        },
        {
            fieldType: 'multiselect',
            label: 'Multi Select',
            description: 'Multiple selection dropdown',
            icon: <ArrowDropDown color="primary" />,
        },
        {
            fieldType: 'date',
            label: 'Date',
            description: 'Date picker input',
            icon: <DateRange color="primary" />,
        },
        {
            fieldType: 'time',
            label: 'Time',
            description: 'Time picker input',
            icon: <AccessTime color="primary" />,
        },
        {
            fieldType: 'datetime',
            label: 'Date Time',
            description: 'Date and time picker',
            icon: <DateRange color="primary" />,
        },
        {
            fieldType: 'url',
            label: 'URL',
            description: 'URL input with validation',
            icon: <Link color="primary" />,
        },
        {
            fieldType: 'tel',
            label: 'Phone',
            description: 'Phone number input',
            icon: <Phone color="primary" />,
        },
        {
            fieldType: 'color',
            label: 'Color',
            description: 'Color picker input',
            icon: <Palette color="primary" />,
        },
        {
            fieldType: 'range',
            label: 'Range',
            description: 'Range slider input',
            icon: <Tune color="primary" />,
        },
        {
            fieldType: 'file',
            label: 'File',
            description: 'File upload input',
            icon: <AttachFile color="primary" />,
        },
    ];

// Główny komponent FieldPalette - paleta dostępnych pól formularza
const FieldPalette: React.FC = () => {
    // Renderowanie JSX komponentu
    return (
        // Główny kontener z paddingiem 2 jednostki
        <Box sx={{ p: 2 }}>
            {/* Nagłówek palety pól */}
            <Typography variant="h6" gutterBottom>
                Field Palette
            </Typography>
            {/* Instrukcja dla użytkownika z marginesem dolnym */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Drag fields to the form builder to create your form
            </Typography>
            {/* Mapowanie przez wszystkie definicje pól i renderowanie FieldPaletteItem dla każdego */}
            {FIELD_DEFINITIONS.map((field) => (
                <FieldPaletteItem
                    key={field.fieldType}           // Unikalny klucz dla React
                    fieldType={field.fieldType}     // Przekazanie typu pola
                    label={field.label}             // Przekazanie etykiety
                    description={field.description} // Przekazanie opisu
                    icon={field.icon}               // Przekazanie ikony
                />
            ))}
        </Box>
    );
};

// Eksport komponentu jako domyślny eksport modułu
export default FieldPalette;