<div id="incp-podentry-access-alert"></div>
<div id="incp-podentry-access">  

    <input type="hidden" name="meta_id" value="{[=it.meta.id]}">

    <div class="l4i-form-group">
      <label class="">SSH Access</label>
      <div class="">
        <div class="form-check form-check-inline">
          <input type="radio" name="operate_access_ssh_on" value="1" onclick="inCpPod.EntryAccessSshRefresh()" {[ if (it.operate.access.ssh_on) { ]}checked="checked"{[ } ]} class="form-check-input">
          <label class="form-check-label">Enable &nbsp;</label>
        </div>
        <div class="form-check form-check-inline">
          <input type="radio" name="operate_access_ssh_on" value="0" onclick="inCpPod.EntryAccessSshRefresh()" {[ if (!it.operate.access.ssh_on) { ]}checked="checked"{[ } ]} class="form-check-input">
          <label class="form-check-label">Disable &nbsp;</label>
        </div>
      </div>
    </div>

    <div id="operate_access_ssh_enable" {[ if (!it.operate.access.ssh_on) { ]}style="display:none"{[ } ]}>
    <div class="l4i-form-group">
      <label class="">SSH Key</label>
      <div class="">
        <textarea name="operate_access_ssh_key" rows="6" class="form-control">{[=it.operate.access.ssh_key]}</textarea>
      </div>
    </div>
    </div>

</div>
