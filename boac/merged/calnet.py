from boac import db
from boac.externals import calnet
from boac.models.team_member import TeamMember


def refresh_cohort_attributes(app, cohorts=None):
    members = cohorts or TeamMember.query.all()
    # Students who play more than one sport will have multiple records.
    member_map = {}
    for m in members:
        member_map.setdefault(m.member_csid, []).append(m)
    csids = list(member_map.keys())

    # Search LDAP.
    all_attrs = calnet.client(app).search_csids(csids)
    if len(csids) != len(all_attrs):
        app.logger.warning('Looked for {} CSIDS but only found {}'.format(
            len(csids),
            len(all_attrs),
        ))

    # Update the DB.
    for attrs in all_attrs:
        # Since we searched LDAP by CSID, we can be fairly sure that the results have CSIDs.
        csid = attrs['csid']
        name_split = attrs['sortable_name'].split(',') if 'sortable_name' in attrs else ''
        full_name = [name.strip() for name in reversed(name_split)]
        for m in member_map[csid]:
            m.member_uid = attrs['uid']
            # A manually-entered ASC name may be more nicely formatted than a student's CalNet default.
            # For now, don't overwrite it.
            m.first_name = m.first_name or (full_name[0] if len(full_name) else '')
            m.last_name = m.last_name or (full_name[1] if len(full_name) > 1 else '')
    return members


def fill_cohort_uids(app):
    to_update = TeamMember.query.filter(TeamMember.member_uid.is_(None)).all()
    refresh_cohort_attributes(app, to_update)
    db.session.commit()
    return to_update
