//=============================================================================
// CounterExtend.js
// ----------------------------------------------------------------------------
// (C)2016 Triacontane
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 2.4.0 2022/02/19 反撃スキルの計算式で、直前に受けたHPダメージを参照できる機能を追加
// 2.3.1 2022/02/07 反撃実行時に厳密な生存判定を追加
// 2.3.0 2022/02/06 相手の行動の直前に反撃を出してから行動を受ける『インターセプター』型の反撃機能を追加
// 2.2.3 2022/01/25 二回行動の敵キャラが一回しか行動できなかったときに反撃するとエラーが発生する問題を修正
// 2.2.2 2021/11/10 タイムプログレス戦闘採用時、2回行動の相手に反撃した場合、相手が以後行動しなくなる問題を修正
// 2.2.1 2021/10/20 行動制約ステートが有効なときに反撃判定が行われてしまう問題を修正
// 2.2.0 2021/08/09 反撃頻度に値を加算できるタグを追加
// 2.1.3 2021/07/31 反撃条件に属性を指定したとき、通常攻撃に付与された属性を考慮していなかった問題を修正
// 2.1.2 2021/07/15 アクティブタイムバトルで、行動入力中に自身の反撃が発動した場合、行動入力後にエラーになる場合がある問題を修正
// 2.1.1 2021/03/08 スクリプトで使用可能な変数の説明とスクリプトの凡例を追加
// 2.1.0 2021/03/07 反撃設定が複数あった場合の判定処理が一部間違っていた問題を修正
//                  スキルに反撃回避率を設定できる機能を追加
// 2.0.1 2021/02/23 タイムプログレス戦闘時、反撃を実行するとチャージタイムのゲージが0に戻ってしまう不具合を修正
// 2.0.0 2021/02/09 MZ向けに全面的に再構築
// 1.9.4 2020/04/07 NRP_CountTimeBattle.jsと併用したとき、戦闘行動の強制による反撃でコマンド入力が回ってきてしまう競合を修正
// 1.9.3 2019/12/30 スキルの属性を指定してからタイプを「なし」にした場合でも、スクリプト「action.hasElement」が元々指定していた属性を返してしまう問題を修正
// 1.9.2 2019/06/09 戦闘行動の強制による反撃を行わない設定のとき、反撃後の自動ステート解除で反撃を有効にするステートを解除した場合、
//                  反撃による敵の行動キャンセルが行われない問題を修正
// 1.9.1 2019/05/02 クロスカウンターで、相手の攻撃が当たった場合のみ反撃する場合は、身代わりによる肩代わりも除外するよう仕様変更
// 1.9.0 2019/04/30 クロスカウンターで、相手の攻撃が当たった場合のみ反撃、もしくは外れた場合のみ反撃できる設定を追加
// 1.8.3 2019/01/29 クロスカウンターによって敵を全滅された後の戦闘で、一部の反撃エフェクトが表示される場合がある問題を修正
// 1.8.2 2019/01/13 クロスカウンター有効時、反撃可能かどうかの再チェックを行うよう修正
//                  「コスト不足で失敗」パラメータ有効時、スキル封印についても考慮するよう修正
// 1.8.1 2018/12/19 クロスカウンター有効時、攻撃によって戦闘不能になったバトラーの反撃が実行される問題を修正
// 1.8.0 2018/12/07 相手が攻撃してきたスキルで反撃する機能を追加
// 1.7.1 2018/09/26 「戦闘行動の強制」を使用しない反撃方法でスキルアニメーションとコモンイベントが呼ばれない問題を修正
//                  反撃が失敗しなかった場合も任意のステートを解除できる機能を追加
// 1.7.0 2018/09/26 「戦闘行動の強制」を使用しない反撃方法を追加しました。動作に若干の違いがあります
// 1.6.0 2018/08/19 コスト不足で反撃が失敗した場合に任意のステートを解除できる機能を追加
//                  魔法反撃に対してコスト不足時発動失敗する機能が正常に動いていなかった問題を修正
// 1.5.0 2018/04/25 スキルに対して個別に反撃されやすさを設定できるようになりました。
// 1.4.4 2018/03/10 反撃条件にスクリプトを使用する際、攻撃してきた相手の情報をtargetで正しく取得できていなかった問題を修正
// 1.4.3 2017/08/09 反撃条件に属性を指定する際に「通常攻撃」を指定した場合も考慮する関数を追加
// 1.4.2 2017/07/12 複数のバトラーが同時に反撃を行った場合に全員分の反撃が正常に行われない問題を修正
// 1.4.1 2017/07/11 1.4.0の機能追加以降、スキル反撃を行うとアクター本来の行動がキャンセルされる場合がある問題を修正
// 1.4.0 2017/06/13 反撃スキルに指定した効果範囲と連続回数が適用されるようになりました。
//                  攻撃を受けてから反撃するクロスカウンター機能を追加
// 1.3.3 2017/06/10 CustumCriticalSoundVer5.jsとの競合を解消
// 1.3.2 2017/05/20 BattleEffectPopup.jsとの併用でスキルによる反撃が表示されない問題を修正。
// 1.3.1 2017/04/22 1.3.0の機能がBattleEngineCoreで動作するよう修正
// 1.3.0 2017/04/09 反撃に成功した時点で相手の行動をキャンセルできる機能を追加
// 1.2.2 2017/02/07 端末依存の記述を削除
// 1.2.1 2017/01/12 メモ欄の値が空で設定された場合にエラーが発生するかもしれない問題を修正
// 1.2.0 2016/11/27 反撃スキルIDを複数設定できる機能を追加。条件に応じたスキルで反撃します。
// 1.1.0 2016/11/20 特定のスキルによる反撃や反撃条件を細かく指定できる機能を追加
// 1.0.0 2016/11/15 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
//=============================================================================

/*:
 * @plugindesc CounterExtendPlugin
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CounterExtend.js
 * @base PluginCommonBase
 * @author triacontane
 *
 * @param CounterList
 * @desc This is a list of counterattack settings. Specify the identifier specified here from each note.
 * @default []
 * @type struct<COUNTER>[]
 *
 * @param UseCounterTrait
 * @desc The characteristic trait "Counter" is added to the "Frequency" for judgment.
 * @default false
 * @type boolean
 *
 * @help CounterExtend.js
 *
 * You can activate skills and items as a reaction (counterattack) to your opponent's actions.
 * You can set up counterattacks under a variety of conditions and settings.
 * This works independently of the "Counterattack Rate" feature, which can be set by default.
 *
 * Specify the following in the memo field (Actor, Occupation, Weapon, Armor, State, Enemy Character)
 * that has the feature.
 * Please specify as follows If the battler has that trait, it will counterattack.
 * For example, if you set it in a state's memo field, the battler with that state on will
 * When the battler is attacked, it will counterattack.
 *
 * <CounterExtend:aaa> # Counterattack with a counterattack setting that matches the identifier [aaa].
 * <CounterExtend:1> # Counterattack with the [1]th counterattack setting in the counterattack list.
 *
 * Detailed counterattack settings can be entered from the plugin parameters.
 * Unlike a normal counterattack, it will be triggered after the opponent's action is over.
 */
/*:ja
 * @plugindesc 反撃拡張プラグイン
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/CounterExtend.js
 * @base PluginCommonBase
 * @author トリアコンタン
 *
 * @param CounterList
 * @text 反撃設定リスト
 * @desc 反撃設定のリストです。ここで指定した識別子を各メモ欄から指定します。
 * @default []
 * @type struct<COUNTER>[]
 *
 * @help CounterExtend.js
 *
 * 相手の行動に対するリアクション(反撃)としてスキル、アイテムを発動できます。
 * 多彩な条件、設定のもとでの反撃設定が可能です。
 * デフォルトで設定できる『反撃率』の特徴とは無関係に動作します。
 *
 * 特徴を有するメモ欄(アクター、職業、武器、防具、ステート、敵キャラ)に
 * 以下の通り指定してください。バトラーがその特徴を持っていると反撃します。
 * 例えば、ステートのメモ欄に設定した場合、そのステートにかかっている
 * バトラーが攻撃を受けると反撃するようになります。
 *
 * <CounterExtend:aaa> # 識別子[aaa]と一致する反撃設定で反撃します。
 * <反撃拡張:aaa>       # 同上
 * <CounterExtend:1>   # 反撃リストの[1]番目の反撃設定で反撃します。
 * <反撃拡張:1>          # 同上
 *
 * 反撃の詳細設定はプラグインパラメータから入力します。
 * 通常の反撃とは異なり、相手の行動が終わってから発動します。
 *
 * メモ欄に以下の通り入力したスキル、アイテムは相手の反撃頻度を
 * 指定した値だけ減らすことができます。
 * <CounterEvasion:100>
 * <反撃回避:100>
 *
 * 〇スクリプトで使用可能なローカル変数
 * subject -> 反撃するバトラー
 * target -> 相手のバトラー
 * triggerAction -> 相手のバトラーが使用した行動
 *
 * 〇反撃スキルの計算式で使用可能な変数
 * a.lastHpDamage -> 反撃者が直前に受けたHPダメージ
 *
 * このプラグインの利用にはベースプラグイン『PluginCommonBase.js』が必要です。
 * 『PluginCommonBase.js』は、RPGツクールMZのインストールフォルダ配下の
 * 以下のフォルダに格納されています。
 * dlc/BasicResources/plugins/official
 *
 */

/*~struct~COUNTER:
 *
 * @param Id
 * @text 識別子
 * @desc カウンター設定を一意に特定する識別子です。各メモ欄には、ここで指定した識別子を指定してください。
 * @default id
 *
 * @param SkillList
 * @text スキルリスト
 * @desc 反撃時に発動するスキルと条件のリストです。複数の条件を満たした場合、リストの上にある方が実行されます。
 * @default []
 * @type struct<SKILL>[]
 *
 * @param Animation
 * @text アニメーション
 * @desc 反撃実行後にアニメーションを表示できます。
 * @default 0
 * @type animation
 *
 * @param Message
 * @text メッセージ
 * @desc 反撃実行後にメッセージを表示できます。
 * @default
 *
 * @param CrossCounter
 * @text クロスカウンター
 * @desc 有効にした場合、攻撃を受けてから反撃します。
 * @default false
 * @type boolean
 *
 * @param Interceptor
 * @text インターセプター
 * @desc 有効にした場合、相手の攻撃を受ける前に割り込んで反撃を出します。
 * @default false
 * @type boolean
 *
 * @param CrossCounterCondition
 * @parent CrossCounter
 * @text クロスカウンター条件
 * @desc クロスカウンターが有効な場合に追加で指定する発動条件です。
 * @default 0
 * @type select
 * @option 常に
 * @value 0
 * @option 相手の行動が当たった場合のみ
 * @value 1
 * @option 相手の行動が外れた場合のみ
 * @value 2
 *
 * @param PayCounterCost
 * @text 反撃コスト消費
 * @desc 反撃がコスト消費するかどうかを設定します。有効にした場合、コストが足りないと反撃しません。
 * @default false
 * @type boolean
 *
 * @param EraseState
 * @text 解除ステート
 * @desc 反撃実行後に指定したステートを自動で解除します。
 * @default 0
 * @type state
 *
 * @param EraseStateCondition
 * @parent EraseState
 * @text 解除ステート条件
 * @desc 解除ステートで指定したステートを解除する条件です。
 * @default 0
 * @type select
 * @option 常に
 * @value 0
 * @option 失敗した場合
 * @value 1
 * @option 成功した場合
 * @value 2
 *
 */

/*~struct~SKILL:
 *
 * @param SkillId
 * @text 反撃スキル
 * @desc 反撃時に発動するスキルです。0を指定した場合、通常攻撃で反撃します。
 * @type skill
 * @default 0
 *
 * @param ItemId
 * @text 反撃アイテム
 * @desc 反撃時に使用するアイテムです。スキルとどちらか一方が指定できます。両方指定するとアイテムの方が優先されます。
 * @type item
 * @default 0
 *
 * @param Reflection
 * @text スキル反射
 * @desc 有効にした場合、相手が使用したスキルを使って反撃します。
 * @type boolean
 * @default false
 *
 * @param IdCondition
 * @text 反撃条件(スキルID)
 * @desc 指定した場合、特定のスキルIDに対してのみ反撃します。
 * @type skill
 * @default 0
 *
 * @param HitTypeCondition
 * @text 反撃条件(命中タイプ)
 * @desc 指定した場合、特定の命中タイプのスキルに対してのみ反撃します。
 * @type select
 * @default 0
 * @option 指定なし
 * @value 0
 * @option 物理攻撃
 * @value 1
 * @option 魔法攻撃
 * @value 2
 *
 * @param ElementCondition
 * @text 反撃条件(属性)
 * @desc 指定した場合、特定の属性(データベースの『タイプ』->『属性』の数値)のスキルに対してのみ反撃します。
 * @type number
 * @default 0
 *
 * @param SwitchCondition
 * @text 反撃条件(スイッチ)
 * @desc 指定した場合、スイッチがONのときのみ反撃します。
 * @type switch
 * @default 0
 *
 * @param ScriptCondition
 * @text 反撃条件(スクリプト)
 * @desc 指定した場合、スクリプトの評価結果が有効なときのみ反撃します。
 * @type combo
 * @default
 * @option subject.mpRate() <= 0.5; // 自分のMPが50%以下の場合
 * @option triggerAction.calcElementRate(subject) > 1.0; // 弱点属性の場合
 *
 * @param Frequency
 * @text 反撃頻度
 * @desc 反撃を実行する頻度(確率)です。100を指定すると必ず反撃します。
 * @type number
 * @default 100
 * @min 0
 * @max 100
 *
 * @param FrequencyTag
 * @text 反撃頻度タグ
 * @desc 指定した名前のタグ（例：<CounterFrequency:100>）から取得した値を『反撃頻度』に加算して判定します。
 * @default CounterFrequency
 *
 */

(function() {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.CounterList) {
        PluginManagerEx.throwError('Param[CounterList] is not found.', script)
    }

    /**
     * Game_CounterAction
     * 反撃行動を扱います。
     */
    class Game_CounterAction extends Game_Action {

        constructor(subject) {
            super(subject, false);
        }

        setup(triggerAction, target) {
            if (triggerAction.isCounter() ||
                this.friendsUnit().members().contains(target) || !this.subject().canMove()) {
                return;
            }
            for (const counter of this.findParams()) {
                if (this.isValidSkill(counter, triggerAction)) {
                    this._counter = counter;
                    return;
                }
            }
            this._counter = null;
        }

        findParams() {
            const tagList = this.subject().traitObjects().map(traitObject => {
                return PluginManagerEx.findMetaValue(traitObject, ['反撃拡張', 'CounterExtend']);
            });
            const indexList = tagList.map(tag => parseInt(tag));
            return param.CounterList.filter((item, index) =>
                tagList.contains(item.Id) || indexList.contains(index + 1));
        }

        isValidSkill(counter, triggerAction) {
            return counter.SkillList.some(skill => this.checkCondition(skill, triggerAction, counter));
        }

        checkCondition(skill, triggerAction, counter) {
            const triggerSkill = triggerAction.item();
            const conditions = [];
            const target = triggerAction.subject();
            const subject = this.subject();
            const evasion = PluginManagerEx.findMetaValue(triggerSkill, ['CounterEvasion', '反撃回避']) || 0;
            const frequency = skill.Frequency + subject.traitObjects().reduce((prev, traitObject) => {
                return prev + PluginManagerEx.findMetaValue(traitObject, skill.FrequencyTag) || 0;
            }, 0);
            const checkParam = (param, value) => param && param !== value;
            conditions.push(() => checkParam(skill.IdCondition, triggerSkill.id));
            conditions.push(() => checkParam(skill.HitTypeCondition, triggerSkill.hitType));
            conditions.push(() => skill.ElementCondition && !triggerAction.hasElement(skill.ElementCondition));
            conditions.push(() => skill.SwitchCondition && !$gameSwitches.value(skill.SwitchCondition));
            conditions.push(() => skill.ScriptCondition && !eval(skill.ScriptCondition));
            conditions.push(() => Math.randomInt(100) >= frequency - evasion);
            conditions.push(() => counter.PayCounterCost && !this.isValid());
            this.setCounterSkill(skill, triggerSkill);
            this.setCounterTarget(target);
            return !conditions.some(condition => condition());
        }

        setCounterSkill(skill, triggerSkill) {
            if (skill.ItemId > 0) {
                this.setItem(skill.ItemId);
                return;
            }
            const skillId = skill.Reflection ? triggerSkill.id : skill.SkillId;
            if (skillId > 0) {
                this.setSkill(skillId);
            } else {
                this.setAttack();
            }
        }

        setCounterTarget(target) {
            if (this.isForOpponent()) {
                this.setTarget(this.opponentsUnit().members().indexOf(target));
            }
            if (this.isForFriend()) {
                this.setTarget(this.friendsUnit().members().indexOf(this.subject()));
            }
        }

        getCounter() {
            return this._counter;
        }

        apply(target) {
            super.apply(target);
            this.removeCounterState(target.result());
        }

        removeCounterState(result) {
            const stateId = this._counter.EraseState;
            if (!stateId) {
                return;
            }
            const condition = this._counter.EraseStateCondition;
            if (condition === 1 && result.isHit()) {
                return;
            }
            if (condition === 2 && !result.isHit()) {
                return;
            }
            this.subject().removeState(stateId);
        }

        isCounter() {
            return true;
        }
    }

    Game_Action.prototype.isCounter = function() {
        return false;
    };

    Game_Action.prototype.getCounter = function() {
        return {};
    };

    Game_Action.prototype.hasElement = function(elementId) {
        if (this.item().damage.type === 0) {
            return false;
        }
        const skillElementId = this.item().damage.elementId;
        // Normal attack elementID[-1]
        if (skillElementId === -1) {
            return this.subject().attackElements().contains(elementId);
        } else {
            return elementId === skillElementId;
        }
    };

    Object.defineProperties(Game_BattlerBase.prototype, {
        lastHpDamage: {
            get: function () {
                const value = this._lastHpDamage || 0;
                this._lastHpDamage = 0;
                return value;
            },
            set: function (value) {
                this._lastHpDamage = value;
            },
            configurable: true
        }
    });

    const _Game_Battler_onDamage = Game_Battler.prototype.onDamage;
    Game_Battler.prototype.onDamage = function(value) {
        _Game_Battler_onDamage.apply(this, arguments);
        this.lastHpDamage = value;
    };

    const _Game_Battler_performActionStart = Game_Battler.prototype.performActionStart;
    Game_Battler.prototype.performActionStart = function(action) {
        if (action.isCounter()) {
            return;
        }
        _Game_Battler_performActionStart.apply(this, arguments);
    };

    const _BattleManager_endBattlerActions = BattleManager.endBattlerActions;
    BattleManager.endBattlerActions = function(battler) {
        if (this._action && this._action.isCounter()) {
            return;
        }
        _BattleManager_endBattlerActions.apply(this, arguments);
    };

    /**
     * BattleManager
     * 反撃を処理します。
     */
    const _BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        _BattleManager_initMembers.apply(this, arguments);
        this._counterQueue = [];
    };

    const _BattleManager_invokeNormalAction = BattleManager.invokeNormalAction;
    BattleManager.invokeNormalAction = function(subject, target) {
        const counterAction = this.createCounterAction(subject, this._action, target);
        const counter = counterAction.getCounter();
        if (!counter || counter.CrossCounter || counter.Interceptor) {
            _BattleManager_invokeNormalAction.apply(this, arguments);
        }
        if (counter && !counter.Interceptor) {
            this.requestCounterAction(target, subject, counterAction);
        }
    };

    BattleManager.createCounterAction = function(subject, action, target) {
        const counterAction = new Game_CounterAction(target);
        counterAction.setup(action, subject);
        return counterAction;
    };

    BattleManager.requestCounterAction = function(counterSubject, subject, counterAction) {
        const counter = counterAction.getCounter();
        if (!this.checkCrossCounterCondition(counterSubject.result(), counter)) {
            return;
        }
        this._counterQueue.push({
            subject: counterSubject,
            target: subject,
            action: counterAction
        });
    };

    const _BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function() {
        _BattleManager_endAction.apply(this, arguments);
        // 行動回数が追加されたバトラーの行動の場合、行動し終わるまでカウンター発動を待機
        if (this._subject && this._subject !== this._currentActor && !this._counterSubject) {
            return;
        }
        const counter = this._counterQueue.shift();
        if (counter) {
            this.invokeCounterAction(counter.subject, counter.target, counter.action);
        } else if (this._counterSubject) {
            this._counterSubject = null;
            this._subject = null;
        }
    };

    const _BattleManager_processTurn = BattleManager.processTurn;
    BattleManager.processTurn = function() {
        _BattleManager_processTurn.apply(this, arguments);
        if (!this._subject && this._counterSubject) {
            this._subject = this._counterSubject;
        }
    };

    BattleManager.invokeCounterAction = function(subject, target, counterAction) {
        if (!subject.canMove() || subject.isDead()) {
            return;
        }
        this._phase = "action";
        this._counterSubject = subject;
        this._subject = subject;
        this._action = counterAction;
        this._targets = counterAction.makeTargets();
        subject.cancelMotionRefresh();
        const counter = counterAction.getCounter();
        if (counter.PayCounterCost) {
            subject.useItem(counterAction.item());
        }
        this._action.applyGlobal();
        this._logWindow.displaySkillCounter(subject, counter);
        this._logWindow.startAction(subject, counterAction, this._targets);
    };

    BattleManager.checkCrossCounterCondition = function(result, counter) {
        if (counter.CrossCounter) {
            if (!result.isHit() && counter.CrossCounterCondition === 1) {
                return false;
            }
            if (result.isHit() && counter.CrossCounterCondition === 2) {
                return false;
            }
        }
        return true;
    };

    /**
     * Window_BattleLog
     * 反撃の演出とメッセージ表示
     */
    Window_BattleLog.prototype.displaySkillCounter = function(subject, counter) {
        if (counter.Message) {
            this.push("addText", counter.Message.format(subject.name()));
        }
        if (counter.Animation) {
            this.push('showAnimation', subject, [subject], counter.Animation);
            this.push('waitForAnimation');
        }
    };

    const _Window_BattleLog_updateWaitMode      = Window_BattleLog.prototype.updateWaitMode;
    Window_BattleLog.prototype.updateWaitMode = function() {
        let waiting = false;
        if (this._waitMode === 'animation') {
            waiting = this._spriteset.isAnimationPlaying();
        }
        if (!waiting) {
            waiting = _Window_BattleLog_updateWaitMode.apply(this, arguments);
        }
        return waiting;
    };

    Window_BattleLog.prototype.waitForAnimation = function() {
        this.setWaitMode('animation');
    };

    const _BattleManager_startAction = BattleManager.startAction;
    BattleManager.startAction = function() {
        const subject = this._subject;
        const action = subject.currentAction();
        const targets = action.makeTargets();
        let intercepted = false;
        targets.forEach(target => {
            const counterAction = this.createCounterAction(subject, action, target);
            const counter = counterAction.getCounter();
            if (counter && counter.Interceptor) {
                this.requestCounterAction(target, subject, counterAction);
                intercepted = true;
            }
        });
        if (intercepted) {
            this._counterQueue.push({
                subject: subject,
                target: targets[0],
                action: action
            });
            this._logWindow.startInterceptedAction(subject, action);
        } else {
            _BattleManager_startAction.apply(this, arguments);
        }
    }

    Window_BattleLog.prototype.startInterceptedAction = function(subject, action) {
        const item = action.item();
        this.push("performActionStart", subject, action);
        this.push("waitForMovement");
        this.push("performAction", subject, action);
        this.displayAction(subject, item);
    };
})();
