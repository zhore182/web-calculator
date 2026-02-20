export interface AutocompleteProps {
  matches: string[];          // Filtered function name matches
  selectedIndex: number;      // Currently highlighted index
  onSelect: (funcName: string) => void;
  visible: boolean;
}

export function Autocomplete({ matches, selectedIndex, onSelect, visible }: AutocompleteProps) {
  if (!visible || matches.length === 0) return null;

  return (
    <div className="autocomplete">
      <ul className="autocomplete__list">
        {matches.map((name, i) => (
          <li
            key={name}
            className={`autocomplete__item ${i === selectedIndex ? 'autocomplete__item--active' : ''}`}
            onClick={() => onSelect(name)}
          >
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
