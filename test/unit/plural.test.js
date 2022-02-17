const {en_plural, en_unplural} = require ('../../lib/plural')

test ('en_plural keep plural as is', () => {
	expect(en_plural ('tb_rso_ctrs')).toBe('tb_rso_ctrs')
})

test ('en_plural plural ok', () => {
	expect(en_plural ('tb_rso_ctr')).toBe('tb_rso_ctrs')
})

test ('en_unplural keep unplural ok', () => {
	expect(en_unplural ('tb_rso_ctr')).toBe('tb_rso_ctr')
})

test ('en_unplural ok', () => {
	expect(en_unplural ('tb_rso_ctrs')).toBe('tb_rso_ctr')
})

test ('en_plural ignore voc_cfo', () => {
	expect(en_plural ('voc_cfo')).toBe('voc_cfo')
})

test ('en_unplural ignore popup', () => {
	expect(en_unplural('voc_budget_art_popup')).toBe('voc_budget_art_popup') 
})
