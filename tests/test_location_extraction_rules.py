from extraction import apply_tenant_location_rules


def test_named_location_group_sets_canonical_location_and_evidence():
    parsed = {"building_name": "Sea View", "raw_payload": {"source": "whatsapp"}}
    result = apply_tenant_location_rules(
        parsed,
        "2 BHK Sea View, near Bandra West station, 1.8 Cr",
        [{
            "id": 7,
            "name": "Bandra West",
            "pattern": r"(?P<location>\bBandra\s+West\b)",
            "canonical_location": "Bandra West",
            "is_active": True,
            "priority": 100,
        }],
    )

    assert result["location_raw"] == "Bandra West"
    assert result["micro_market"] == "Bandra West"
    assert result["location"]["source"] == "tenant_regex_rule"
    assert result["raw_payload"]["tenant_location_rule"]["rule_id"] == 7
    assert "tenant_location_rule_match" in result["validation_flags"]


def test_inactive_or_non_matching_rules_do_not_change_parse():
    parsed = {"building_name": "Sea View", "micro_market": "Existing"}
    result = apply_tenant_location_rules(
        parsed,
        "2 BHK Sea View in Juhu",
        [
            {"id": 1, "pattern": r"Bandra", "canonical_location": "Bandra", "is_active": False},
            {"id": 2, "pattern": r"Powai", "canonical_location": "Powai", "is_active": True},
        ],
    )
    assert result == parsed


def test_first_matching_rule_wins_by_supplied_priority_order():
    parsed = {"building_name": "Sea View"}
    result = apply_tenant_location_rules(
        parsed,
        "Available in Bandra West",
        [
            {"id": 10, "pattern": r"Bandra", "canonical_location": "Bandra", "is_active": True},
            {"id": 11, "pattern": r"Bandra\s+West", "canonical_location": "Bandra West", "is_active": True},
        ],
    )
    assert result["micro_market"] == "Bandra"
