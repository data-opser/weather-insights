{%- macro set_primary_key(column) -%}
    {% if execute %}
        {% set check_constraint_query %}
            select * from information_schema.table_constraints
            where constraint_name = '{{ this.schema }}_{{ this.name }}_pkey'
                and constraint_type = 'PRIMARY KEY'
        {% endset %}

        {% set result = run_query(check_constraint_query) %}

        {% set value = result.columns[0][0] %}

        {% if value is none %}
            ALTER TABLE {{ this.schema }}.{{ this.name }}
                ADD CONSTRAINT {{ this.schema }}_{{ this.name }}_pkey PRIMARY KEY ({{ column }});
        {% endif %}
    {%- endif -%}
{%- endmacro -%}