import React, { useState, useEffect } from "react";
import Select from "./Select";
import { getStateNames, getDistrictsByState } from "../../data/statesData";

const LocationSelector = ({
  state,
  district,
  onStateChange,
  onDistrictChange,
  stateLabel = "State",
  districtLabel = "District",
  stateRequired = false,
  districtRequired = false,
  stateError,
  districtError,
  statePlaceholder = "Select State",
  districtPlaceholder = "Select District",
  className = "",
  showDistrict = true,
}) => {
  const [states] = useState(getStateNames());
  const [districts, setDistricts] = useState([]);

  // Update districts when state changes
  useEffect(() => {
    if (state) {
      const stateDistricts = getDistrictsByState(state);
      setDistricts(stateDistricts);
    } else {
      setDistricts([]);
      // Clear district if state is cleared
      if (district && onDistrictChange) {
        onDistrictChange({ target: { value: "" } });
      }
    }
  }, [state]);

  const handleStateChange = (e) => {
    const newState = e.target.value;
    if (onStateChange) {
      onStateChange(e);
    }
    // Clear district when state changes
    if (district && onDistrictChange) {
      onDistrictChange({ target: { value: "" } });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Select
        label={stateLabel}
        name="state"
        value={state}
        onChange={handleStateChange}
        options={states}
        placeholder={statePlaceholder}
        required={stateRequired}
        error={stateError}
      />

      {showDistrict && (
        <Select
          label={districtLabel}
          name="district"
          value={district}
          onChange={onDistrictChange}
          options={districts}
          placeholder={districtPlaceholder}
          required={districtRequired}
          error={districtError}
          disabled={!state || districts.length === 0}
        />
      )}
    </div>
  );
};

export default LocationSelector;
