import React from 'react';

export default ({ index, classes, sign, classcad, user, message, diff, onItemClicked, wrap, style }) => (
    <div style={{ display: 'flex', ...( index === 0 ? styles.firstItem : {} ), ...style }}
        className={`log ${sign === '>>>' ? 'inverted' : ''}`}>

        <span onClick={e => onItemClicked && onItemClicked(e.target.textContent)}
            className={`classcad color-${classcad.color}-600`} style={styles.td95}>
            {classcad.key}
        </span>

        <span onClick={e => onItemClicked && onItemClicked(e.target.textContent)}
            className={`user color-${user.color}-600`} style={styles.td95}>
            {user.key.substring(0, 11)}
        </span>

        <span onClick={e => onItemClicked && onItemClicked(e.target.textContent)}
            className="sign" style={styles.td30}>
            {sign}
        </span>

        <span className="message" style={wrap ? { overflow: 'hidden' } : {}}>
            <span onClick={e => onItemClicked && onItemClicked(e.target.textContent)}
                className={`${classes}`} style={wrap ? { whiteSpace: 'nowrap' } : {} }>
                {message}
            </span>
        </span>

        <span style={{ ...styles.tdflex, textAlign: (diff ? 'right' : 'initial') }}>
            {diff ? `+${diff}ms` : ''}
        </span>

    </div>
);

const styles = {
    firstItem: { alignItems: 'flex-end', height: '100%' },
    td95: { minWidth: 95, marginRight: 5 },
    td30: { minWidth: 30, marginRight: 5 },
    tdflex: { flex: 1, minWidth: 60, marginLeft: 5 }
}
